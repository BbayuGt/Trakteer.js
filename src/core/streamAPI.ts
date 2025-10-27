import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { EventEmitter, RawData, WebSocket } from "ws";
import {
    Donation,
    Goal,
    lastSupporter,
    latestTip,
    leaderboard,
    rawDonation,
    supporter,
} from "../interfaces";

interface ClientEvents {
    donation: (message: Donation) => void;
    connect: (timestamp: Date) => void;
    disconnect: (timestamp: Date) => void;
    ping_sent: (timestamp: Date) => void;
    pong_received: (timestamp: Date) => void;
}

export declare interface streamAPIInterface {
    on<U extends keyof ClientEvents>(event: U, listener: ClientEvents[U]): this;
    once<U extends keyof ClientEvents>(
        event: U,
        listener: ClientEvents[U],
    ): this;
}

type WSMessage = {
    channel?: string;
    event: string;
    data?: unknown;
};

export type streamKey = `trstream-${string}`;

export class streamAPI extends EventEmitter implements streamAPIInterface {
    username: string;
    streamKey: streamKey;
    userId: string | undefined;
    client: WebSocket | undefined;
    agent?: HttpsProxyAgent<string>;
    isConnected: boolean = false;
    autoReconnect: boolean = true;
    private userAgent: string | undefined;

   /**
     * Client Class
     * @param pageID should be the trakteer page id (NOT Username). check pageID in https://trakteer.id/manage/my-page/settings
     * @param streamKey should be `trstream-xxx`. check key in https://trakteer.id/manage/stream-settings
     */
    constructor(
        pageID: string,
        streamKey: `trstream-${string}`,
        proxy?: string,
        userAgent?: string,
    ) {
        super();
        this.username = pageID;
        this.streamKey = streamKey;
        this.userAgent = userAgent;
        this.reconnect();

        if (proxy) this.agent = new HttpsProxyAgent(proxy);
    }

    private reconnect() {
        if (this.client) {
            this.client.removeAllListeners();
            this.client.terminate();
        }

        this.client = new WebSocket(
            "wss://socket.trakteer.id/app/2ae25d102cc6cd41100a?protocol=7&client=js&version=5.1.1&flash=false",
            {
                agent: this.agent,
                headers: {
                    "User-Agent":
                        this.userAgent ??
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                },
            },
        );

        this.client.once("open", () => {
            axios
                .get(
                    `https://trakteer.id/${this.username}/stream?key=${this.streamKey}`,
                    {
                        httpsAgent: this.agent,
                    },
                )
                .then((data) => {

                    if (!this.client) throw new Error("WebSocket client not initialized");

                    const userid: unknown = data.data;

                    // validasi userid
                    if (typeof userid !== "string")
                        throw new Error(
                            "Failed to read userId data! Invalid key/username?",
                        );

                    const result = /creator-stream\.(.*?)\./gi.exec(userid);

                    if (!data.data || !result || !result![1])
                        throw new Error(
                            "Failed to read userId data! Invalid key/username?",
                        );
                    else this.userId = result![1];

                    //Subscribe ke Streaming agar mendapatkan feedback

                    this.client.send(
                        JSON.stringify({
                            event: "pusher:subscribe",
                            data: {
                                auth: "",
                                channel: `creator-stream.${this.userId}.${this.streamKey}`,
                            },
                        }),
                    );

                    // Kirim ping agar tidak di disconnect
                    setInterval(() => {
                        if (!this.client) return;
                        this.emit("ping_sent", new Date());
                        this.client.send(
                            JSON.stringify({
                                data: {},
                                event: "pusher:ping",
                            }),
                        );
                    }, 5000);

                    //Subscribe ke Streaming test agar mendapatkan feedback
                    this.client.send(
                        JSON.stringify({
                            event: "pusher:subscribe",
                            data: {
                                auth: "",
                                channel: `creator-stream-test.${this.userId}.${this.streamKey}`,
                            },
                        }),
                    );

                    this.isConnected = true;
                    this.emit("connect", new Date());
                });
        });

        this.client.on("message", (message) => {
            const msg = JSON.parse(message.toString()) as WSMessage;
            switch (msg.event) {
                case "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated":
                {
                    if (typeof msg.data !== "string") return;
                    const msgdata = JSON.parse(msg.data) as rawDonation & Donation;
                    msgdata.price_number = parseInt(
                        msgdata.price.replace(/[^\d,]/gm, "").replace(",", "."),
                    );
                    this.emit("donation", msgdata);
                }
                break;
                case "pusher:pong": {
                    this.emit("pong_received", new Date());
                }
                break;

            }
        });

        this.client.once("close", () => {
            if (this.autoReconnect) {
                setTimeout(() => {
                    this.reconnect();
                }, 5000);
            }
            this.isConnected = false;
            this.emit("disconnect", new Date());
        });

    }

    /**
     * Get last donation
     *
     * @returns {lastSupporter}
     */
    async getLastSupporter(): Promise<lastSupporter> {
        const data = await axios.get<lastSupporter>(
            `https://api.trakteer.id/v2/${this.streamKey}/last-supporters-data`,
            {
                httpsAgent: this.agent,
            },
        );

        // They suddenly change sum type from number to string, changing it back to number
        data.data.supporter.sum = parseInt(data.data.supporter.sum as unknown as string);

        return data.data;
    }

    /**
     * Get the latest tips
     * @param amount amount of tips to get
     * @returns {latestTip}
     */
    async getLatestTip(amount = 3): Promise<latestTip> {
        const data = await axios.get<latestTip>(
            `https://api.trakteer.id/v2/stream/${this.streamKey}/latest-tips?limit=${amount}`,
            {
                httpsAgent: this.agent,
            },
        );

        // They suddenly change quantity type from number to string, changing it back to number
        data.data.latestTip.map(x => {
            if (typeof x.quantity === "string") x.quantity = parseInt(x.quantity);
            return x;
        })

        return data.data;
    }

    /**
     * Get Donation Leaderboard
     * @param dayInterval Get Donation from last x day
     * @param maxAmount Max Amount of leadedrboard
     * @param sortBy Sort By Rupiah amount or Unit Amount
     * @returns Leaderboard
     */
    async getLeaderboard(
        dayInterval: number = 7,
        maxAmount: number = 10,
        sortBy: "nominal" | "unit" = "unit",
    ): Promise<leaderboard> {
        const data = (
            await axios.get<unknown>(
                `https://api.trakteer.id/v2/stream/${this.streamKey}/top-supporters?interval=${dayInterval}&count=${maxAmount}&sortby=${sortBy}`,
                {
                    httpsAgent: this.agent,
                },
            )
        ).data as leaderboard;

        data.unitIcon = (/"(.+?)"/gm.exec(data.unitIcon as string) as any)[1];
        data.supporter = data.supporter.map((x) => {
            x.sum = parseInt(x.sum as unknown as string);
            return x;
        }) as any;
        return data;
    }

    /**
     * Get Supporter from all time
     * @param amount Amount of supporter to get
     * @returns supporter list
     */
    async getSupporter(amount: number = 10): Promise<supporter[]> {
        let data = (
            await axios.get<any>(
                `https://api.trakteer.id/v2/stream/${this.streamKey}/latest-tips?limit=${amount}`,
                {
                    httpsAgent: this.agent,
                },
            )
        ).data.latestTip as supporter[];

        // They suddenly change quantity type from number to string, changing it back to number
        data = data.map((x)=> {
            if (typeof x.quantity === "string") x.quantity = parseInt(x.quantity);
            return x;
        })

        return data;
    }

    /**
     * Get Goal
     * @returns Goal
     */
    async getGoal(): Promise<Goal> {
        const data = (
            await axios.get<any>(
                `https://api.trakteer.id/v2/stream/${this.streamKey}/target-data`,
                {
                    httpsAgent: this.agent,
                },
            )
        ).data;

        const [currentGoal, targetGoal]: number[] = data.targetValue
            .replace(/\./g, "")
            .split("/")
            .map((x: string) => parseFloat(x.replace("Rp ", "")));
        // A bit long, lul. short this please loll
        // 'Rp 0 / Rp 75.000' <~ This should be the original text.

        return {
            target: {
                current: currentGoal,
                target: targetGoal,
                progress: parseInt(data.targetProgress),
            },
            title: data.targetTitle,
            url: data.pageUrl,
        };
    }
}
