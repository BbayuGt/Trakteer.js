export default interface CreatePaymentCache<d = any> {
    /**
     * Time of cache creation
     */
    createdAt: number;

    /**
     * Cache expiration time
     */
    expiresAt: number;

    /**
     * Cache data
     */
    data: d;
}
