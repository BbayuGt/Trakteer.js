import Cache from '../src/etc/Cache';
import { describe, expect, test } from 'bun:test';

describe("Test Cache", () => {
	test("Cache", () => {
		Cache.set("test", "test");
		expect(Cache.get("test")?.data).toBe("test");

		Cache.set("test", "test", 0);
		Cache.refreshAllCache();
		expect(Cache.get("test")).toBeUndefined();

		Cache.set("test", "test", 5000);
		Cache.refreshAllCache();
		expect(Cache.get("test")).not.toBeUndefined();
	})
})
