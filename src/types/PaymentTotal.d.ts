
export default interface PaymentTotal {
	/**
	 * Harga dalam rupiah
	 */
	price: number;

	/**
	 * Metode Pembayaran
	 */
	payment_method: string;

	/**
	 * Apakah biaya admin dibayar oleh supporter
	 */
	is_payment_fee_by_supporter: boolean;

	/**
	 * Pajak pembayaran
	 */
	payment_fee: number;

	/**
	 * Pajak Transfer
	 */
	transfer_fee: number;

	/**
	 * Total Biaya yang harus dibayar
	 */
	total_price: number;
}
