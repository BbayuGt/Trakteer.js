# Trakteer.js
Unofficial Trakteer Streaming API (Using websocket)

# This API is still in development. some bug might found

# Usage

Using this API is very simple. just need a few line and you're ready to go!
```js
const trakteer = require("trakteerjs")
const client = new trakteer.Client("PageID", "Stream APIKEY") //Initialize trakteer client

client.start() //Start client.

client.on("connect", ()=> {
    console.log("Connected!") // Triggered When connected
})

client.on("donation", (donation)=> {
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

client.getGoal().then(goal=>{
    console.log(goal)
    /*
        {
            target: { current: 69000, target: 420000, progress: 69.420 },
            title: 'Goal Title',
            url: 'trakteer.id/YourPageID'
        }
    */
})

```