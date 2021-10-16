import { Client } from "../src";

const client = new Client("BbayuGt", "trstream-vRDTSMjON5m8Sbj5rHiP")
client.start()

client.onOpen(()=> {
    console.log("Connected")
})

client.onDonation((donation:Object)=>{
    console.log(donation)
})