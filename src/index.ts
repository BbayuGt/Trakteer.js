import axios, { AxiosResponse } from "axios";
import {WebSocket} from "ws"

const client = new WebSocket("wss://socket.trakteer.id/app/2ae25d102cc6cd41100a?protocol=7&client=js&version=5.1.1&flash=false")

setInterval(()=>{
    client.send(JSON.stringify({
        data: {},
        event: "pusher:ping"
    }))
}, 5000)

export class Client {
    username:string
    streamKey:`trstream-${string}`
    userId:string | undefined

    constructor(username:string, streamKey:`trstream-${string}`) {
        this.username = username
        this.streamKey = streamKey
    }

    async start() {
        const data = (await axios.get(`https://trakteer.id/${this.username}/stream?key=${this.streamKey}`))
        const userid:any = data.data
        const result = (/creator-stream\.(.*?)\./gi.exec(userid))
        
        this.userId = result![1]

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
    }

    onOpen(cb:CallableFunction) {
        client.on("open", () => {
            cb(true)
            return
        })
    }

    onDonation(cb:CallableFunction) {
        client.on("message", (message)=> {
            if (message.toString().startsWith(`{"channel"`)) {
                cb(JSON.parse(JSON.parse(message.toString()).data))
            }
        })
    }
}