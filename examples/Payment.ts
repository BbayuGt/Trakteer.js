import * as trakteer from "../src" 
const { Payment, User } = trakteer;

// Get all available payment methods

async function getPaymentMethods() {
	const payments = await Payment.getPaymentMethods();
	console.log(payments);
}
getPaymentMethods();

// Create payment with qris

async function createQR() {
	// find the userId
	const userId = await User.getUserId("trakteer.id");
	if (userId instanceof Error) return console.error(userId.message);
	const qr = await Payment.createPayment(userId, "qris", 10);
	console.log(qr);
}
createQR();
