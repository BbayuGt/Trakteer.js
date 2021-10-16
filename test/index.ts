import { Client } from "../src";

const client = new Client("PageID", "Stream key") //Cek page id di : https://trakteer.id/manage/my-page/settings
client.start()

client.onOpen(()=> {
    console.log("Connected")
})

client.onDonation((donation:Object)=>{
    console.log(donation)
})