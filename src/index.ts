import axios, { AxiosResponse } from "axios";
import {EventEmitter, RawData, WebSocket} from "ws"
import { Goal } from "./interfaces";

const client = new WebSocket("wss://socket.trakteer.id/app/2ae25d102cc6cd41100a?protocol=7&client=js&version=5.1.1&flash=false", )

setInterval(()=>{
    client.send(JSON.stringify({
        data: {},
        event: "pusher:ping"
    }))
}, 5000)

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
    private messages:RawData[] = []

    /**
     * Client Class
     * @param pageID should be the trakteer page id (NOT Username). check pageID in https://trakteer.id/manage/my-page/settings
     * @param streamKey should be `trstream-xxx`. check key in https://trakteer.id/manage/stream-settings
     */
    constructor(pageID:string, streamKey:`trstream-${string}`) {
        super();
        this.username = pageID
        this.streamKey = streamKey

        client.once("open", () => {
            this.emit("connect")
        })

        client.on("message", (message)=>{
            if (message.toString().startsWith(`{"channel"`)) {
                this.emit("donation", JSON.parse(JSON.parse(message.toString()).data))
            }
        })

    }

    /**
     * please use this before using any code. to initialize the client
     */
    async start() {
        const data = (await axios.get(`https://trakteer.id/${this.username}/stream?key=${this.streamKey}`))
        const userid:any = data.data
        const result = (/creator-stream\.(.*?)\./gi.exec(userid))
        
        this.userId = result![1]

        client.once("open", () => { //Fix WebSocket.send error at startup

            //Subscribe ke Streaming agar mendapatkan feedback
            client.send(JSON.stringify({
                event: "pusher:subscribe",
                data:{
                    auth: "",
                    channel: `creator-stream.${this.userId}.${this.streamKey}`
                }
            }))
    
            //Subscribe ke Streaming test agar mendapatkan feedback
            client.send(JSON.stringify({
                event: "pusher:subscribe",
                data:{
                    auth: "",
                    channel: `creator-stream-test.${this.userId}.${this.streamKey}`
                }
            }))

        })
    }


    async getGoal():Promise<Goal> {
        const data = (await axios.get<any>(`https://api.trakteer.id/v2/stream/${this.streamKey}/target-data`)).data
        let [currentGoal, targetGoal]:number[] = data.targetValue
            .replace(/\./g, "")
            .split("/")
            .map((x:string)=>parseInt(x.replace("Rp ", "")))
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
     * @deprecated This will removed on first beta, please use `client.on("open")` instead.
     */
    onOpen(cb:CallableFunction) {
        client.on("open", () => {
            cb(true)
            return
        })
    }

    /**
     * 
     * @param cb This will triggered when donation is detected
     * @deprecated This will removed on first beta, please use `client.on("donation")` instead.
     */
    onDonation(cb:CallableFunction) {
        client.on("message", (message)=> {
            if (message.toString().startsWith(`{"channel"`)) {
                cb(JSON.parse(JSON.parse(message.toString()).data))
            }
        })
    }
}