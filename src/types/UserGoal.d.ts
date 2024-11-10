
export default interface UserGoal {
	/**
	 * Judul goal
	 */
	title: string;

	/**
	 * Deskripsi goal
	 */
	description: string;

	/**
	 * Progress goal (float dalam bentuk string)
	 * @example "0.5"
	 */
	progress: string;

	/**
	 * Target goal (float dalam bentuk string)
	 * @example "10000.0"
	 */
	target_price: string;

	/**
	 * Donasi yang diterima (float dalam bentuk string)
	 * @example "5000.0"
	 */
	total_received: string;

}
