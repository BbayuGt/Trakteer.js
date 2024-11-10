
export default interface CreatePaymentConfig {
	/**
	 * Nama donatur
	 */
	display_name: string;
	
	/**
	 * Email donatur (guest)
	 */
	guest_email: string;

	/**
	 * Apakah donatur ingin menyembunyikan nama?
	 */
	is_anonym: boolean;

	/**
	 * Apakah donatur ingin menyembunyikan pesan?
	 */
	is_private: boolean;

	/**
	 * Perlihatkan email dengan creator
	 */
	is_showing_email: boolean;

	/**
	 * Pesan donasi
	 */
	support_message: string;


}
