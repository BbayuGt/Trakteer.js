
import { User } from '../src/core/User';
import { Payment } from '../src/core/Payment';
import { describe, expect, test } from 'bun:test';

describe("Test Payment", () => {
	test("Get Payment Methods", async () => {
		const paymentMethods = await Payment.getPaymentMethods();
		expect(paymentMethods).not.toBeNull();
		expect(paymentMethods).toBeObject();
	})

	test("Get Total Amount", async () => {
		const totalAmount = await Payment.getTotalAmount("gopay", 100);
		expect(totalAmount).not.toBe(Error);
		if (totalAmount instanceof Error) return;
		expect(totalAmount).toBeObject();
		expect(totalAmount).toContainKey("is_payment_fee_by_supporter");
		expect(totalAmount).toContainKey("payment_method");
		expect(totalAmount.payment_method).toBe("gopay");
		expect(totalAmount).toContainKey("price");
		expect(totalAmount.price).toBe(100);
		expect(totalAmount).toContainKey("payment_fee");
		expect(totalAmount).toContainKey("transfer_fee");
		expect(totalAmount).toContainKey("total_price");
	})

	test("Get Total Amount (Error)", async () => {
		expect(async () => Payment.getTotalAmount("notExist", 10)).toThrowError();
	})
});

describe("Test createPayment", () => {
	test("Create Midtrans Payment", () => {
		expect(async () => {
			const userId = await User.getUserId("trakteer.id");
			if (userId instanceof Error) return;
			const payment = await Payment.createPayment(userId, "gopay", 100);

			return payment;
		}, "Gopay/Midtrans Fails").toBeObject();
	});

	test("Create Xendit Payment", async() => {
			const userId = await User.getUserId("trakteer.id");
			if (userId instanceof Error) return;
			const payment = await Payment.createPayment(userId, "dana", 100);
			return payment;
	});
})

describe("Test createPayment (Error)", () => {
	test("Create Payment (Error) - Minimum amount not met", async () => {
		const userId = await User.getUserId("trakteer.id");
		if (userId instanceof Error) return;
		expect(async () => Payment.createPayment(userId, "qris", 1)).toThrowError();
	})

	test("Create Payment (Error) - OVO - Phone Number not set", async () => {
		const userId = await User.getUserId("trakteer.id");
		if (userId instanceof Error) return;
		expect(async () => Payment.createPayment(userId, "ovo", 100)).toThrowError();
	})

	test("Create Payment (Error) - LinkAja - Phone Number not set", async () => {
		const userId = await User.getUserId("trakteer.id");
		if (userId instanceof Error) return;
		expect(async () => Payment.createPayment(userId, "linkaja", 100)).toThrowError();
	});

	test("Create Payment (Error) - Jenius - Cashtag not set", async () => {
		const userId = await User.getUserId("trakteer.id");
		if (userId instanceof Error) return;
		expect(async () => Payment.createPayment(userId, "jenius", 100)).toThrowError();
	});

	test("Create Payment (Error) - Jenius - Cashtag not valid", async () => {
		const userId = await User.getUserId("trakteer.id");
		if (userId instanceof Error) return;
		expect(async () => Payment.createPayment(userId, "jenius", 100, { cashtag: "notValid" })).toThrowError();
	});
});
