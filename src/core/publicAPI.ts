import axios from "axios";
import { supportHistory } from "../interfaces";

/**
 * Public API - Use the official API From trakteer
 * @see https://trakteer.id/manage/api-trakteer
 */
export class publicAPI {
    public APIkey?:string;
    
    constructor (apiKey:string) {
        this.APIkey = apiKey;
    }

    /**
     * API ini digunakan untuk melihat jumlah unit trakteer-an yang telah diberikan oleh supporter (berdasarkan email) selama 30 hari terakhir.
     * @param email Supporter Email
     * @returns is unknown, please open issue if you have one example.
     */
    async quantityGiven(email:string) {
        const req = await axios.post("https://api.trakteer.id/v1/public/quantity-given", {
            email
        }, {
            headers: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "key":this.APIkey,
            }
        })
        return req.data
    }


    /**
     * API ini digunakan untuk mendapatkan riwayat trakteer-an yang diberikan oleh supporter.
     * @param limit Number of records
     * @param page Current page in paginated records
     * @returns support history
     */
    async supportHistory(limit = 10, page = 1):Promise<supportHistory> {
        const req = await axios.get(`https://api.trakteer.id/v1/public/support-history?limit=${limit}&page=${page}`, {
            headers: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "key":this.APIkey,
            }
        })
        return req.data
    }
}