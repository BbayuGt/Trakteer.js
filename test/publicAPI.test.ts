import { publicAPI } from "../src";
import { describe, test, expect } from "bun:test";

if (!process.env.APIKEY) throw new Error("APIKEY is not defined");
const client = new publicAPI(process.env.APIKEY); //Cek APIkey di https://trakteer.id/manage/api-trakteer

describe("it should get user info", () => {
  test("quantityGiven", async () => {
    const result = await client.quantityGiven("test@example.com");
    expect(result).toBeObject();
  });

  test("supportHistory", async () => {
    const result = await client.supportHistory();
    expect(result).toBeObject();
    console.log(result);
  });

  test("currentBalance", async () => {
    const result = await client.currentBalance();
    expect(result).toBeNumber();
  });

  test("transactionHistory", async () => {
    const result = await client.transactionHistory();
    expect(result).toBeObject();
    console.log(result);
  });
});
