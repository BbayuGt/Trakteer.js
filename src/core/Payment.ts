import axios from "axios";
import PaymentMethod from "../types/PaymentMethod";
import Cache from "../etc/Cache";
import PaymentTotal from "../types/PaymentTotal";
import CreatePaymentConfig from "../types/CreatePaymentConfig";
import User from "./User";

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

	static async generateNewToken(): Promise<{
		csrf: string;
		cookie: string;
	} | Error> {
		const req = await axios.get("https://trakteer.id/BbayuGt", {
			withCredentials: true,
		});
		const csrfMatch = req.data.match(
			/(?<=\"csrf-token\" content=\")(.*?)(?=\")/,
		);
		if (!csrfMatch) throw new Error("Failed to get csrf token");
		
		if (!req.headers["set-cookie"]) throw new Error("Failed to get cookie");
		const cookie = req.headers["set-cookie"]
			.map((a: string) => a.split(";")[0])
			.join("; ");

		return {
			csrf: csrfMatch[0],
			cookie: cookie,
		};
	}

    /**
     *
     */
    static async createPayment(
        creatorId: string,
        paymentMethod: string,
        amount: number,
        config?: CreatePaymentConfig,
    ): Promise<URL | Error> {
        const paymentMethods = await this.getPaymentMethods();

        if (paymentMethods instanceof Error) throw paymentMethods;
        if (!paymentMethods[paymentMethod])
            throw new Error("Invalid payment method");

        const userDetail = await User.getUserDetails(creatorId);
        if (userDetail instanceof Error) throw userDetail;

        switch (paymentMethod) {
            case "qris":
                {
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
                    };

                    const csrf = await axios.get(
                        "https://trakteer.id/BbayuGt",
                        {
                            withCredentials: true,
                        },
                    ); // Hey that's my page! Consider to donate to me too :D
                    const csrfMatch = csrf.data.match(
                        /(?<=\"csrf-token\" content=\")(.*?)(?=\")/,
                    ); // Match crf token from meta tag, i don't want to use cheerio or something similar, so i think regex'll work
                    if (!csrf.headers["set-cookie"])
                        throw new Error("Failed to get csrf token");
                    const cookie = csrf.headers["set-cookie"]
                        .map((a: string) => a.split(";")[0])
                        .join("; ");

                    if (!csrfMatch) throw new Error("Failed to get csrf token");

                    const req = await axios
                        .post<{
                            checkout_url: string;
                        }>("https://trakteer.id/pay/xendit/qris", payload, {
                            withCredentials: true,
                            withXSRFToken: true,
                            headers: {
                                "X-Csrf-Token": csrfMatch[0],
                                cookie: cookie,
                            },
                        })
                        .catch((e) => {
                            if (e.status === 500)
                                throw new Error(
                                    "Failed to create payment, cek minimum donation" +
                                        JSON.stringify(payload, null, 2) +
                                        JSON.stringify(e, null, 2),
                                );
                            console.log(JSON.stringify(e, null, 2));
                            throw new Error(e);
                        });

                    if (req.status === 201)
                        return new URL(req.data.checkout_url);
                    else throw new Error("Failed to create payment");
                }
                break;
        }
    }
}
