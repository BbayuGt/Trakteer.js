import axios from "axios";
import { supportHistory } from "../interfaces";
import createHttpsProxyAgent from "https-proxy-agent";

/**
 * Public API - Use the official API From trakteer
 * @see https://trakteer.id/manage/api-trakteer
 */
export class publicAPI {
  public APIkey?: string;
  private proxy?: createHttpsProxyAgent.HttpsProxyAgentOptions | string;
  private userAgent?: string;

  constructor(
    apiKey: string,
    proxy?: string | createHttpsProxyAgent.HttpsProxyAgentOptions,
    userAgent?: string
  ) {
    this.APIkey = apiKey;
    (this.proxy = proxy), (this.userAgent = userAgent);
  }

  /**
   * API ini digunakan untuk melihat jumlah unit trakteer-an yang telah diberikan oleh supporter (berdasarkan email) selama 30 hari terakhir.
   * @param email Supporter Email
   * @returns is unknown, please open issue if you have one example.
   */
  async quantityGiven(email: string) {
    const req = await axios.post(
      "https://api.trakteer.id/v1/public/quantity-given",
      {
        email,
      },
      {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          key: this.APIkey,
          "User-Agent": this.userAgent,
        },
        httpsAgent: this.proxy,
      }
    );
    return req.data;
  }

  /**
   * API ini digunakan untuk mendapatkan riwayat trakteer-an yang diberikan oleh supporter.
   * @param limit Number of records
   * @param page Current page in paginated records
   * @returns support history
   */
  async supportHistory(limit = 10, page = 1): Promise<supportHistory> {
    const req = await axios.get(
      `https://api.trakteer.id/v1/public/supports?limit=${limit}&page=${page}`,
      {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          key: this.APIkey,
        },
        httpsAgent: this.proxy,
      }
    );
    return req.data;
  }

  /**
   * API ini digunakan untuk melihat jumlah saldo yang dimiliki.
   * @returns Amount of balance
   */
  async currentBalance(): Promise<number | string> {
    const req = await axios.get(
      `https://api.trakteer.id/v1/public/current-balance`,
      {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          key: this.APIkey,
        },
        httpsAgent: this.proxy,
      }
    );
    if (!req.data || req.data.status !== "success")
      return req.data.message as string;
    else return parseFloat(req.data.result);
  }

  async transactionHistory(limit = 5, page = 1) {
    const req = await axios.get(
      `https://api.trakteer.id/v1/public/transactions?limit=${limit}&page=${page}`,
      {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          key: this.APIkey,
        },
        httpsAgent: this.proxy,
      }
    );
    return req.data;
  }
}
