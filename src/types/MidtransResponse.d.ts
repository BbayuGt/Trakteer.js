export interface MidtransResponse {
    /**
     * Status code
     */
    status_code: string;

    /**
     * Status message
     */
    status_message: string;

    /**
     * Transaction ID
     */
    transaction_id: string;

    /**
     * Order ID
     */
    order_id: string;

    /**
     * Merchant ID
     */
    merchant_id: string;

    /**
     * Gross amount
     */
    gross_amount: string;

    /**
     * Currency
     * @example IDR
     */
    currency: string;

    /**
     * Payment type
     */
    payment_type: string;

    /**
     * Transaction time
     */
    transaction_time: string;

    /**
     * Transaction status
     */
    transaction_status: string;

    /**
     * Fraud status
     */
    fraud_status: string;

    /**
     * VA Number (only if payment type is echannel)
     */
    bill_key?: string;

    /**
     * Company Code (only if payment type is echannel)
     */
    biller_code?: string;

    /**
     * Virtual Account (only if the payment type is bank_transfer)
     */
    va_numbers?: {
        bank: string;
        va_number: string;
    }[];

    /**
     * Expiry time
     */
    expiry_time: string;

    /**
     * qrcode URL
     */
    qr_code_url?: string;

    /**
     * Link checkout (khusus shopeepay)
     */
    deeplink_url?: string;

    /**
     * Permata VA Number (only if payment type is permata_va)
     */
    permata_va_number?: string;

    /**
     * Expire time
     */
    billpayment_expiration: string;

    /**
     * Raw expire time
     */
    billpayment_expiration_raw: string;

    /**
     * PDF URL
     */
    pdf_url: string;

    /**
     * Finish payment URL redirect
     */
    finish_redirect_url: string;

    /**
     * Finish payment URL redirect for 200 status
     */
    finish_200_redirect_url: string;

    /**
     * Charge type, usually "echannel"
     */
    charge_type: string;
}
