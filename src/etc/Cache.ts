import CreatePaymentCache from "../types/Cache";

class Cache {
    private cache: Map<string, CreatePaymentCache> = new Map();

    constructor() {
        setInterval(() => {
            this.refreshAllCache();
        }, 5000);
    }

    public get<type>(key: string): CreatePaymentCache<type> | undefined {
        return this.cache.get(key);
    }

    public set(key: string, value: any, expireTime = 15000): void {
        this.cache.set(key, {
            data: value,
            createdAt: Date.now(),
            expiresAt: Date.now() + expireTime,
        });
    }

    public refreshAllCache(): void {
        this.cache.forEach((value, key) => {
            if (value.expiresAt < Date.now()) this.cache.delete(key);
        });
    }
}
export default new Cache();
