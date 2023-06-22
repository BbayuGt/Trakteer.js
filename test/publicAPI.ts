import { publicAPI } from "../src"

const client = new publicAPI("trapi-xxx") //Cek APIkey di https://trakteer.id/manage/api-trakteer
// Or use Proxy!
const clientProxy = new publicAPI("trapi-xxx")

client.quantityGiven("test@example.com").then(x=>{
    console.log(x)
    /**
     * 
        {
            "status": "success",
            "status_code": 200,
            "result": {
                "data": [
                    {
                        "supporter_name": "example",
                        "support_message": "Pesan Dukungan",
                        "quantity": 5,
                        "amount": 5000,
                        "unit_name": "Cendol",
                        "updated_at": "2022-07-02 09:25:20"
                    }
                ],
                "meta": {
                    "include": [
                        "is_guest",
                        "reply_message",
                        "net_amount",
                        "payment_method",
                        "order_id",
                        "updated_at_diff_label"
                    ],
                    "pagination": {
                        "total": 41,
                        "count": 1,
                        "per_page": 1,
                        "current_page": 1,
                        "total_pages": 41,
                        "links": {
                            "next": "https://api.trakteer.id/v1/public/support-history?page=2"
                        }
                    }
                }
            },
            "message": "OK"
        }
     */
})

client.supportHistory().then(x=> {
    console.log(x)
    /**
     * @todo example is unknown
     */
})