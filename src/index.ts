import axios, { AxiosResponse } from "axios";
import createHttpsProxyAgent, { HttpsProxyAgent } from "https-proxy-agent";
import {EventEmitter, RawData, WebSocket} from "ws"
import { Goal, leaderboard } from "./interfaces";

interface ClientEvents {
    'donation': (event:string, donation:Function) => void
    'connect': (event:string, listener:Function) => void
}

export declare interface Client {
    on<U extends keyof ClientEvents>(event:U, listener: ClientEvents[U]):this
}

export class Client extends EventEmitter {
    username:string
    streamKey:`trstream-${string}`
    userId:string | undefined
    client:WebSocket
    agent: HttpsProxyAgent | undefined
    private messages:RawData[] = []

    /**
     * Client Class
     * @param pageID should be the trakteer page id (NOT Username). check pageID in https://trakteer.id/manage/my-page/settings
     * @param streamKey should be `trstream-xxx`. check key in https://trakteer.id/manage/stream-settings
     */
    constructor(pageID:string, streamKey:`trstream-${string}`, proxy?:string | createHttpsProxyAgent.HttpsProxyAgentOptions) {
        super();
        this.username = pageID
        this.streamKey = streamKey

        this.agent = !!proxy ? new HttpsProxyAgent(proxy) : undefined
        this.client = new WebSocket("wss://socket.trakteer.id/app/2ae25d102cc6cd41100a?protocol=7&client=js&version=5.1.1&flash=false", {
            agent:this.agent
        })
        

        // It will connect automatically. instead of calling this.start(). start will be useless now
        this.client.once("open", () => {
            axios.get(`https://trakteer.id/${this.username}/stream?key=${this.streamKey}`, {
                httpsAgent:this.agent
            }).then((data)=> {
                const userid:any = data.data
                const result = (/creator-stream\.(.*?)\./gi.exec(userid))
                
                if (!data.data || !result || !result![1]) throw new Error("Failed to read userId data! Invalid key/username?")
                else this.userId = result![1]

                //Subscribe ke Streaming agar mendapatkan feedback
                this.client.send(JSON.stringify({
                    event: "pusher:subscribe",
                    data:{
                        auth: "",
                        channel: `creator-stream.${this.userId}.${this.streamKey}`
                    }
                }))

                // Kirim ping agar tidak di disconnect
                setInterval(()=>{
                    this.client.send(JSON.stringify({
                        data: {},
                        event: "pusher:ping"
                    }))
                }, 5000)
        
                //Subscribe ke Streaming test agar mendapatkan feedback
                this.client.send(JSON.stringify({
                    event: "pusher:subscribe",
                    data:{
                        auth: "",
                        channel: `creator-stream-test.${this.userId}.${this.streamKey}`
                    }
                }))

                this.emit("connect")
            })
        })

        this.client.on("message", (message)=>{
            if (message.toString().startsWith(`{"channel"`)) {
                this.emit("donation", JSON.parse(JSON.parse(message.toString()).data))
            }
        })
    }


    /**
     * @deprecated this will do nothing. will remove it in later version. please remove this line
     * 
     */
    async start() {
        
    }
    

    
    async getLeaderboard(dayInterval:number=7, maxAmount:number=10, sortBy:"nominal" | "unit"="unit"):Promise<leaderboard> {
        const data = (await axios.get<any>(`https://api.trakteer.id/v2/stream/${this.streamKey}/top-supporters?interval=${dayInterval}&count=${maxAmount}&sortby=${sortBy}`, {
            httpsAgent:this.agent
        })).data as leaderboard
        
        data.unitIcon = (/"(.+?)"/gm.exec(data.unitIcon as string) as any)[1]
        data.supporter = data.supporter.map(x=>{
            x.sum = parseInt(x.sum as unknown as string)
            return x
        }) as any
        return data
    }


    async getGoal():Promise<Goal> {
        const data = (await axios.get<any>(`https://api.trakteer.id/v2/stream/${this.streamKey}/target-data`, {
            httpsAgent:this.agent
        })).data
        
        let [currentGoal, targetGoal]:number[] = data.targetValue
            .replace(/\./g, "")
            .split("/")
            .map((x:string)=>parseFloat(x.replace("Rp ", "")))
            // A bit long, lul. short this please loll
            // 'Rp 0 / Rp 75.000' <~ This should be the original text.

        return {
            target:{
                current:currentGoal,
                target:targetGoal,
                progress:parseInt(data.targetProgress)
            },
            title:data.targetTitle,
            url:data.pageUrl
        }
    }

    /**
     * 
     * @param cb This will triggered when The client is ready.
     * @deprecated This will removed on later version, please use `client.on("open")` instead.
     */
    onOpen(cb:CallableFunction) {
        this.client.on("open", () => {
            cb(true)
            return
        })
    }

    /**
     * 
     * @param cb This will triggered when donation is detected
     * @deprecated This will removed on later version, please use `client.on("donation")` instead.
     */
    onDonation(cb:CallableFunction) {
        this.client.on("message", (message)=> {
            if (message.toString().startsWith(`{"channel"`)) {
                cb(JSON.parse(JSON.parse(message.toString()).data))
            }
        })
    }
}