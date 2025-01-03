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
}

export declare interface streamAPI {
    on<U extends keyof ClientEvents>(event: U, listener: ClientEvents[U]): this;
    once<U extends keyof ClientEvents>(
        event: U,
        listener: ClientEvents[U],
    ): this;
}

type WSMessage = {
    channel?: string;
    event: string;
    data?: any;
};

export type streamKey = `trstream-${string}`;

export class streamAPI extends EventEmitter {
    username: string;
    streamKey: streamKey;
    userId: string | undefined;
    client: WebSocket;
    agent?: HttpsProxyAgent<string>;
    isConnected: boolean = false;
    private messages: RawData[] = [];
    private pingInterval: Timer | undefined;

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

        if (proxy) this.agent = new HttpsProxyAgent(proxy);
        this.client = new WebSocket(
            "wss://socket.trakteer.id/app/2ae25d102cc6cd41100a?protocol=7&client=js&version=5.1.1&flash=false",
            {
                agent: this.agent,
                headers: {
                    "User-Agent":
                        userAgent ??
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
                    const userid: any = data.data;
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
                    this.pingInterval = setInterval(() => {
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
            if (
                msg.event ===
                "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated"
            ) {
                const msgdata = JSON.parse(msg.data) as rawDonation & Donation;
                msgdata.price_number = parseInt(
                    msgdata.price.replace(/[^\d\,]/gm, "").replace(",", "."),
                );
                this.emit("donation", msgdata);
            }
        });

        this.client.once("close", (code, reason) => {
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

        return data.data;
    }

    /**
     * Get the latest tips
     * @param amount amount of tips to get
     * @returns {latestTip}
     */
    async getLatestTip(amount = 3): Promise<latestTip> {
        const data = await axios.get<latestTip>(
            `https://api.trakteer.id/v2/stream/${this.streamKey}/latest-tips?limit=15`,
            {
                httpsAgent: this.agent,
            },
        );

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
            await axios.get<any>(
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
        const data = (
            await axios.get<any>(
                `https://api.trakteer.id/v2/stream/${this.streamKey}/latest-tips?limit=${amount}`,
                {
                    httpsAgent: this.agent,
                },
            )
        ).data.latestTip as supporter[];

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

        let [currentGoal, targetGoal]: number[] = data.targetValue
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
