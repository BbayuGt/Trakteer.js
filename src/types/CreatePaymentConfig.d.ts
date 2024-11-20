export default interface CreatePaymentConfig {
    /**
     * Nama donatur
     */
    display_name?: string;

    /**
     * Email donatur (guest)
     */
    guest_email?: string;

    /**
     * Apakah donatur ingin menyembunyikan nama?
     */
    is_anonym?: boolean;

    /**
     * Apakah donatur ingin menyembunyikan pesan?
     */
    is_private?: boolean;

    /**
     * Perlihatkan email dengan creator
     */
    is_showing_email?: boolean;

    /**
     * Pesan donasi
     */
    support_message?: string;

    /**
     * Must start wth "08", not +62
     * (Khusus OVO) Nomor telepon donatur
     */
    ovo_phone?: `08${string}`;

    /**
     * Must start wth "08", not +62
     * (Khusus LinkAja) Nomor telepon donatur
     */
    linkaja_phone?: `08${string}`;

    /**
     * (Khusus Jenius) Cashtag donatur
     */
    cashtag?: string;
}
