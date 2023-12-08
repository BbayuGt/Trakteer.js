import createHttpsProxyAgent from "https-proxy-agent";
import axios, { AxiosInstance } from "axios";
import htmlParser from "node-html-parser";


/**
 * Private API - Uses XSRF Token to use the API.
 */
export class privateAPI {
    private proxy?: createHttpsProxyAgent.HttpsProxyAgentOptions | string;
    private client:AxiosInstance;
    
    constructor (XSRFToken:string, trakteerSession: string, proxy?:string | createHttpsProxyAgent.HttpsProxyAgentOptions, userAgent?: string) {
        this.proxy = proxy;
        this.client = axios.create({
            headers: {
                "Cookie": `XSRF-TOKEN=${XSRFToken}; trakteer-sess=${trakteerSession}`,
                "User-Agent": userAgent ?? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"
            },
            withCredentials: true,
            httpsAgent: this.proxy
        })
    }
    
    /**
     * Overview API to access overview data
     * @returns Overview APIs
     */
    Overview() {
        return {
            getSummarry: async () => {
                const req = await this.client.get("https://trakteer.id/manage/dashboard")
                const document = htmlParser.parse(req.data)
                const summaryList:number[] = document.querySelectorAll("#my-page-container > div > div.row > div")
                    .map(doc => doc.querySelector("a > div > div > h3")?.innerText ?? "")
                    .map(x => x.replace(/[a-zA-Z.,\ ]/g, ""))
                    .map(x => Number(x))

                const [currentBalance, currentMonthBalance, totalSupporter, amountDisbursed, activeSupporter] = summaryList
                return {
                    currentBalance,
                    currentMonthBalance,
                    totalSupporter,
                    amountDisbursed,
                    activeSupporter
                }
            }
        }
    }

}