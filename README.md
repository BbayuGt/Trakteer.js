# Trakteer.js
Unofficial Trakteer Streaming API (Using websocket)

# Usage

Using this API is very simple. just need a few line and you're ready to go!
```js
const trakteer = require("trakteerjs")
const client = new Client("PageID", "trstream-xxx") //Cek page id di : https://trakteer.id/manage/my-page/settings

client.on("connect", ()=> {
    console.log("connected")
})

client.on("donation", (donation:Object)=>{
    console.log(donation)
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

client.getLeaderboard().then(result=>{
    console.log(result)
    /*
    {
        pageUrl: 'trakteer.id/PageID',
        unitIcon: 'https://trakteer.id/storage/images/units/uic-xxx.png',
        unitName: 'My Unit name!',
        supporter: [
            { supporter_name: '', avatar: null, sum: 69 },
            {
                supporter_name: 'BbayuGt',
                avatar: 'https://lh3.googleusercontent.com/a-/AOh14Gi45Ig9QTQozpqkD_SgPcB190KAwStLhex1Y-CT5w=s96-c',
                sum: 420
            }
        ]
    }
    */
})

client.getGoal().then(result=>{
    console.log(result)
    /*
        {
            target: { current: 69000, target: 420000, progress: 69.420 },
            title: 'Goal Title',
            url: 'trakteer.id/YourPageID'
        }
    */
})

```