import { streamAPI } from "../src";
import { describe, expect, test } from "bun:test";

if (!process.env.PAGEID || !process.env.STREAM_APIKEY)
  throw new Error("PAGEID or STREAM_APIKEY is not defined");

const client = new streamAPI(
  process.env.PAGEID,
  process.env.STREAM_APIKEY as any
); //Cek page id di : https://trakteer.id/manage/my-page/settings

describe("should connect to stream", async () => {
  test("should connect", () => {
    client.once("connect", (ts) => {
      expect(client.isConnected).toBeTrue();
      expect(ts).toBeDate();
    });
  });

  test("Should fire on donation", () => {
    client.once("donation", (donation: Object) => {
      expect(donation).toBeObject();
    });
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

client.getSupporter(2).then((result) => {
  console.log(result);
  /*
        [
            {
                display_name: 'Name #1',
                support_message: 'Hello!!',
                quantity: 12
            },
            {
                display_name: 'Name #2',
                support_message: 'Sup!',
                quantity: 10
            }
        ]
    */
});
