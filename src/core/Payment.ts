import axios from "axios";
import PaymentMethod from "../types/PaymentMethod";
import Cache from "../etc/Cache";
import PaymentTotal from "../types/PaymentTotal";
import CreatePaymentConfig from "../types/CreatePaymentConfig";
import User from "./User";
import MidtransResponse from "../types/MidtransResponse";


/**
 * Payment class
 * @class
 * @classdesc this class does all of the payment related stuff
 */
export default class Payment {
    /**
     * Cek semua metode pembayaran yang tersedia
     * @returns Metode pembayaran yang tersedia
     */
    static async getPaymentMethods(): Promise<
        Record<string, PaymentMethod> | Error
    > {
        const cache =
            Cache.get<Record<string, PaymentMethod>>("paymentMethods");

        if (cache) return cache.data;
        const req = await axios.get(
            "https://api.trakteer.id/v2/fe/payment-methods",
        );

        if (typeof req.data !== "object") throw new Error("Invalid response");
        if (!req.data.data) throw new Error(req.data.message);

        Cache.set("paymentMethods", req.data.data, 60000);
        return req.data.data;
    }

    /**
     * Mendapatkan total biaya yang harus dibayar
     * @param paymentMethod Metode pembayaran
     * @param amount Jumlah yang harus dibayar
     * @param is_payment_fee_by_supporter Apakah biaya admin dibayar oleh supporter
     * @returns Total biaya yang harus dibayar
     */
    static async getTotalAmount(
        paymentMethod: string,
        amount: number,
        is_payment_fee_by_supporter = true,
    ): Promise<PaymentTotal | Error> {
        const req = await axios.post(
            "https://api.trakteer.id/v2/fe/payment/total",
            {
                is_payment_fee_by_supporter,
                payment_method: paymentMethod,
                price: amount,
            },
        );

        if (req.data.status === "error") throw new Error(req.data.message);
        return req.data.data;
    }

	/**
	 * Get new CSRF token and cookie
	 */
    static async generateNewToken(): Promise<
        | {
              csrf: string;
              cookie: string;
          }
        | Error
    > {
        const cache = Cache.get<{
            csrf: string;
            cookie: string;
        }>("csrfCookies");
        if (cache) return cache.data;

        const req = await axios.get("https://trakteer.id/BbayuGt", {
            withCredentials: true,
        });
        const csrfMatch = req.data.match(
            /(?<="csrf-token" content=")(.*?)(?=")/,
        );
        if (!csrfMatch) throw new Error("Failed to get csrf token");

        if (!req.headers["set-cookie"]) throw new Error("Failed to get cookie");
        const cookie = req.headers["set-cookie"]
            .map((a: string) => a.split(";")[0])
            .join("; ");

        Cache.set(
            "csrfCookies",
            {
                csrf: csrfMatch[0],
                cookie: cookie,
            },
            60 * 60 * 1000,
        ); // 1 hour

        return {
            csrf: csrfMatch[0],
            cookie: cookie,
        };
    }

    /**
     * Membuat pembayaran
     * @param creatorId ID kreator
     * @param paymentMethod Metode pembayaran
     * @param amount Jumlah yang harus dibayar
     * @param config Konfigurasi pembayaran
     */
    static async createPayment(
        creatorId: string,
        paymentMethod: string,
        amount: number,
        config?: CreatePaymentConfig,
    ): Promise<URL | MidtransResponse | Error> {
        const paymentMethods = await this.getPaymentMethods();

        if (paymentMethods instanceof Error) throw paymentMethods;
        if (!paymentMethods[paymentMethod])
            throw new Error("Invalid payment method");

        const userDetail = await User.getUserDetails(creatorId);
        if (userDetail instanceof Error) throw userDetail;

        switch (paymentMethods[paymentMethod].gateway) {
            case "xendit":
                {
                    const paymentMethodData = paymentMethods[paymentMethod];
                    if (
                        paymentMethodData.min_price &&
                        amount <
                            paymentMethodData.min_price /
                                parseInt(userDetail.active_unit.data.price)
                    ) {
                        throw new Error(
                            "Minimum donation for this method is Rp. " +
                                paymentMethodData.min_price,
                        );
                    }
                    if (paymentMethod === "ovo" && !config?.ovo_phone)
                        throw new Error(
                            "OVO phone number is required for OVO payment method",
                        );
                    if (paymentMethod === "linkaja" && !config?.linkaja_phone)
                        throw new Error(
                            "LinkAja phone number is required for LinkAja payment method",
                        );
                    if (paymentMethod === "jenius" && !config?.cashtag)
                        throw new Error(
                            "Cashtag is required for Jenius payment method",
                        );

                    const payload = {
                        creator_id: creatorId,
                        display_name: config?.display_name ?? "Seseorang",
                        form: "create-tip",
                        guest_email:
                            config?.guest_email ?? "notexist@not.ex.ist", // Email is mandatory, but fake email is fine
                        is_anonym: (config?.is_anonym ?? false) ? "on" : "off",
                        is_private:
                            (config?.is_private ?? false) ? "on" : "off",
                        is_remember_next: "off",
                        is_showing_email:
                            (config?.is_showing_email ?? false) ? "on" : "off",
                        payment_method: paymentMethod,
                        quantity: amount,
                        support_message: config?.support_message ?? "",
                        times: "once",
                        unit_id: userDetail.active_unit.data.id,
                        ovo_phone: config?.ovo_phone ?? undefined,
                        linkaja_phone: config?.linkaja_phone ?? undefined,
                        cashtag: config?.cashtag ?? undefined,
                    };

                    const token = await this.generateNewToken();
                    if (token instanceof Error) throw token;

                    const req = await axios
                        .post<{
                            checkout_url?: string;
                            order_id?: string;
                        }>(
                            `https://trakteer.id/pay/xendit/${paymentMethod}`,
                            payload,
                            {
                                withCredentials: true,
                                withXSRFToken: true,
                                headers: {
                                    "X-Csrf-Token": token.csrf,
                                    cookie: token.cookie,
                                },
                            },
                        )
                        .catch((e) => {
                            if (e.status === 500)
                                throw new Error(
                                    "Failed to create payment, cek minimum donation" +
                                        JSON.stringify(payload, null, 2) +
                                        JSON.stringify(e, null, 2),
                                );
                            if (e.status === 401 && paymentMethod === "jenius")
                                throw new Error("Cashtag is invalid");
                            throw new Error(e);
                        });

                    if (req.data.checkout_url) {
                        return new URL(req.data.checkout_url);
                    } else if (req.data.order_id) {
                        return new URL(
                            `https://trakteer.id/payment-status/${req.data.order_id}`,
                        );
                    } else
                        throw new Error(
                            "Failed to create payment" +
                                JSON.stringify(req.data, null, 2),
                        );
                }
                break;

            case "midtrans": {
                const paymentMethodData = paymentMethods[paymentMethod];
                if (
                    paymentMethodData.min_price &&
                    amount <
                        paymentMethodData.min_price /
                            parseInt(userDetail.active_unit.data.price)
                ) {
                    throw new Error(
                        "Minimum donation for this method is Rp. " +
                            paymentMethodData.min_price,
                    );
                }

                const payload = {
                    creator_id: creatorId,
                    display_name: config?.display_name ?? "Seseorang",
                    form: "create-tip",
                    guest_email: config?.guest_email ?? "notexist@not.ex.ist", // Email is mandatory, but fake email is fine
                    is_anonym: (config?.is_anonym ?? false) ? "on" : "off",
                    is_private: (config?.is_private ?? false) ? "on" : "off",
                    is_remember_next: "off",
                    is_showing_email:
                        (config?.is_showing_email ?? false) ? "on" : "off",
                    payment_method: paymentMethod,
                    quantity: amount,
                    support_message: config?.support_message ?? "",
                    times: "once",
                    unit_id: userDetail.active_unit.data.id,
                };

                const token = await this.generateNewToken();
                if (token instanceof Error) throw token;

                const req = await axios.post<MidtransResponse>(
                    `https://trakteer.id/pay/midtrans/${paymentMethod}`,
                    payload,
                    {
                        withCredentials: true,
                        withXSRFToken: true,
                        headers: {
                            "X-Csrf-Token": token.csrf,
                            cookie: token.cookie,
                        },
                    },
                );

                if (req.status === 200) {
                    // This will return the midtrans token
                    const reqToken = req.data;

                    // Get available channel
                    const reqChannel = await axios.get<{
                        enabled_payments: {
                            type: string;
                            status: "up" | "down";
                        }[];
                    }>(
                        `https://app.midtrans.com/snap/v1/transactions/${reqToken}`,
                    );
                    const enabledPayments = reqChannel.data.enabled_payments
                        .filter((a) => a.status === "up")
                        .map((a) => a.type);

                    if (enabledPayments.length === 0)
                        throw new Error("No payment channel available");

                    const reqMidtrans = await axios.post<MidtransResponse>(
                        `https://app.midtrans.com/snap/v2/transactions/${reqToken}/charge`,
                        {
                            payment_type: enabledPayments[0],
                            promo_details: null,
                        },
                        {
                            withCredentials: true,
                            headers: {
                                "X-Csrf-Token": token.csrf,
                                cookie: token.cookie,
                            },
                        },
                    );

                    if (reqMidtrans.status === 200) {
                        return reqMidtrans.data;
                    } else {
                        throw new Error(
                            "Failed to create payment" +
                                JSON.stringify(reqMidtrans.data),
                        );
                    }
                }
            }
            break;

            case "trakteer":
                throw new Error("Payment method not supported (require login)");

            default:
                throw new Error("Payment method not supported");
        }
        throw new Error("Unhandled payment method");
    }
}
