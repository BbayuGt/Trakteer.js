export default interface PageStatus {
	/**
	 * Apakah page ini di-restricted?
	 */
	is_restricted: boolean;

	/**
	 * Apakah page ini di-suspend?
	 */
	is_suspended: boolean;

	/**
	 * Apakah page ini sedang di-review?
	 */
	is_under_review: boolean;

	/**
	 * Apakah page ini aktif?
	 */
	is_page_active: boolean;

	/**
	 * Apakah page ini bisa di donasi?
	 */
	is_support_enabled: boolean;
}
