# Trakteer.js
Unofficial Trakteer Streaming API (Using websocket)

# This API is still in development. some bug might found

# Usage
Javascript
```js
const trakteer = require("trakteerjs")
const client = new trakteer.Client("Username", "Stream APIKEY") //Initialize trakteer client

client.start() //Start client.

client.onOpen(()=> {
    console.log("Connected!") // Triggered When connected
})

client.onDonation((donation)=> {
    console.log(donation)
    // Output :
    /*
        {
            tip_id:"id",
            supporter_name:"Supporter name",
            unit:"Unit name",
            quantity:1,
            supporter_message:"Supporter message",
            supporter_avatar:"Avatar url",
            unit_icon:"Unit icon url",
            price:"Rp 1.0000",
            id: "Id", //unknown use
            type: "new_tip" // No use for now.
        }
    */
})
```