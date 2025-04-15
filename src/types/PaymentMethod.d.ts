export default interface PaymentMethod {
    /**
     * Method ID
     * @example "ovo"
     */
    method: string;

    /**
     * Nama Payment Gateway
     */
    gateway: "midtrans" | "xendit" | "trakteer" | "ipay" | null;

    /**
     * Label Group
     */
    group_label: string;

    /**
     * Group Order, tidak diketahui kegunaannya
     */
    group_order: number;

    /**
     * Icon URL
     * @example "https:\/\/cdn.trakteer.id\/images\/mix\/qris.png?date=18-11-2023"
     */
    icon: string;

    /**
     * Mobile Icon URL
     * @example "https:\/\/cdn.trakteer.id\/images\/mix\/qris_v2.png?date=18-11-2023"
     */
    icon_mobile: string;

    /**
     * Nama Payment Method
     */
    label: string;

    /**
     * Deskripsi promo, tidak ada isi saat testing
     */
    promo: string;

    /**
     * Deskripsi Payment Method
     */
    description: string;

    /**
     * Status Payment Method
     */
    status: "available" | "disabled";

    /**
     * Pesan, tidak ada isi saat testing
     */
    message: string;

    /**
     * Minimal donasi
     */
    min_price: number | null;

    /**
     * Maksimal donasi
     */
    max_price: number | null;

    /**
     * Apakah diperlukan login
     */
    login_required: boolean;

    /**
     * Apa memiliki fee tambahan
     */
    has_exclusive_payment_fee: boolean;

    /**
     * Apakah memiliki fee dalam uang
     */
    fee?: number;

    /**
     * Jumlah fee dalam persen
     */
    fee_percent?: number;

    /**
     * Jumlah PPN
     */
    ppn?: number;

    ipay_fee?: Record<string, string>;
}
