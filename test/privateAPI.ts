import { privateAPI } from "../src/core/privateAPI";

const client = new privateAPI("eyJpdiI6IkJsd1IwcEg5bFMxeEVMQmVFQ1lYaFE9PSIsInZhbHVlIjoiekVxMWE4cDBCemFhZG41UGpsSEcxVnJqa1Y3Z2NcL3VZRUtnXC94WEZ0bXd1TUlYQlBjc0VmQUJrZEVjMWlXODB3IiwibWFjIjoiYzJjN2NhM2M3Njk2ZDcxZDgwMzgyMzFjZDFmNmYzMGIwMTUzZmFkNDEzNjBmYmZkMmU4OTg2YWM2OGVjMmJmNyJ9", "eyJpdiI6IjBcL25JUkt4ZGcwUUhtVitEVmpHOVl3PT0iLCJ2YWx1ZSI6IjVsQytnNGM0WmFNOEJkUWlqTFwvOFZKTFdvMUJuV3RzXC9wWXlaYTM2R3JabTFER3QrSmVDMXBWdGF4MU1sT3JIOCIsIm1hYyI6IjMyZjVhN2ZiOGFiOWQwYjdjMTM3OTMxNTIyZTg5OWMxZTZmZDU3YTBjMjA4ZmExNDQyZmRmZjExMjM0ZGZjMzcifQ%3D%3D")

client.Overview().getSummarry().then(result=>{
    console.log(`Current Balance: ${result.currentBalance}`)
    console.log(`Current Month Balance: ${result.currentMonthBalance}`)
    console.log(`Total Supporter: ${result.totalSupporter}`)
    console.log(`Amount Disbursed: ${result.amountDisbursed}`)
    console.log(`Active Supporter: ${result.activeSupporter}`)
})