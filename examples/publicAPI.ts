import * as trakteer from "../src";

if (!process.env.APIKEY) throw new Error("Please provide APIKEY");

const client = new trakteer.publicAPI(process.env.APIKEY);

client.currentBalance().then((balance) => {
  if (balance instanceof Error) return console.error(balance.message);

  console.log(`Saldo saat ini: ${balance}`);
});

client.quantityGiven("email").then((qty) => {
  if (qty instanceof Error) return console.error(qty.message);

  console.log(`Jumlah donasi: ${qty}`);
});

client.supportHistory().then((history) => {
  console.log(history.result?.data.map((donation) => donation.supporter_name));
});

client.transactionHistory().then((history) => {
  console.log(
    history.result?.data.map((transaction) => transaction.support_message)
  );
});
