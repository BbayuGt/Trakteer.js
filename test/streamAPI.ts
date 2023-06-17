import { streamAPI } from "../src";

const client = new streamAPI("PageID", "trstream-xxx") //Cek page id di : https://trakteer.id/manage/my-page/settings
// Or use Proxy!
const clientProxy = new streamAPI("PageID", "trstream-xxx", "https://proxy.com:1234/")

client.on("connect", (timestamp)=> {
    console.log("Connected on " + timestamp)
})

client.on("disconnect", (timestamp) => {
    console.log("Disconnected on " + timestamp)
})

client.on("donation", (donation)=>{
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

client.getSupporter(2).then((result)=> {
    console.log(result)
    /*
        [
            {
                display_name: 'Name #1',
                support_message: 'Hello!!',
                quantity: 12
            },
            {
                display_name: 'Name #2',
                support_message: 'Sup!',
                quantity: 10
            }
        ]
    */
})