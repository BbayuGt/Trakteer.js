import { streamAPI } from "../src";
import { describe, expect, test } from "bun:test";
import { once } from "events";
import { Donation } from "../src/interfaces";

if (!process.env.PAGEID || !process.env.STREAM_APIKEY || typeof process.env.PAGEID !== "string" || typeof process.env.STREAM_APIKEY !== "string")
  throw new Error("PAGEID or STREAM_APIKEY is not defined");

if (!process.env.STREAM_APIKEY.startsWith("trstream-"))
  throw new Error("STREAM_APIKEY is invalid, make sure to use the correct API key from trakteer.id");

const client = new streamAPI(
  process.env.PAGEID,
  process.env.STREAM_APIKEY as "trstream-${string}"
); //Cek page id di : https://trakteer.id/manage/my-page/settings

describe("should connect to stream", async () => {
  test("should connect", () => {
    client.once("connect", (ts) => {
      expect(client.isConnected).toBeTrue();
      expect(ts).toBeDate();
    });
  });

  test("Should fire on donation", async () => {
    const [donation] = (await once(client, "donation")) as Donation[];
    expect(donation).toBeObject();
    expect(donation).toContainKeys([
      "id",
      "media",
      "price",
      "price_number",
      "quantity",
      "supporter_avatar",
      "supporter_message",
      "supporter_name",
      "type",
      "unit",
      "unit_icon",
    ]);
    expect(donation.price_number).toBeNumber();
  });

  test("Get last donation", async () => {
    const res = await client.getLastSupporter();
    expect(res).toBeObject();
    expect(res.unitIcon).toBeString();
    expect(res.unitName).toBeString();
    expect(res.supporter).toBeObject();
    expect(res.supporter.sum).toBeNumber();
    expect(res.supporter.name).toBeString();
    expect(res.supporter.support_message).toBeString();
  });

  test("Get the latest tip", async () => {
    const res = await client.getLatestTip();
    expect(res).toBeObject();
    expect(res.latestTip).toBeArray();
    expect(res.unitIcon).toBeString();
    expect(res.unitName).toBeString();
    if (res.latestTip[0]) {
      expect(res.latestTip[0]).toBeObject();
      expect(res.latestTip[0].display_name).toBeString();
      expect(res.latestTip[0].quantity).toBeNumber();
      expect(res.latestTip[0].support_message).toBeString();
    }
  });

  test("Get the leaderboard", async () => {
    const res = await client.getLeaderboard();
    expect(res).toBeObject();
    expect(res.pageUrl).toBeString();
    expect(res.supporter).toBeArray();
    expect(res.unitIcon).toBeString();
    expect(res.unitName).toBeString();
  });

  test("Get Goal Information", async () => {
    const res = await client.getGoal();
    console.log(res);
    expect(res.target).toBeObject();
    expect(res.target.current).toBeNumber();
    expect(res.target.progress).toBeNumber();
    expect(res.title).toBeString();
    expect(res.url).toBeString();
  });

  test("Get Supporter", async () => {
    const res = await client.getSupporter();
    expect(res).toBeArray();
    if (res[0]) {
      expect(res[0]).toBeObject();
      expect(res[0].display_name).toBeString();
      expect(res[0].support_message).toBeString();
      expect(res[0].quantity).toBeNumber();
    }
  });
});
