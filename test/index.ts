import { Client } from "../src";

const client = new Client("Username", "Stream key")
client.start()

client.onOpen(()=> {
    console.log("Connected")
})

client.onDonation((donation:Object)=>{
    console.log(donation)
})