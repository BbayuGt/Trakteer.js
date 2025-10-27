import * as trakteer from "../src";
import { streamKey } from "../src";

if (!process.env.PAGEID || !process.env.STREAM_APIKEY)
  throw new Error("Please provide PAGEID and STREAM_APIKEY");
const client = new trakteer.streamAPI(
  process.env.PAGEID,
  process.env.STREAM_APIKEY as streamKey
);

// check if connected
client.on("connect", async (ts) => {
  console.log(
    "Berhasil terkoneksi dengan API Trakteer pada " + ts.toLocaleTimeString()
  );

  // cek donasi
  client.on("donation", (donation) => {
    console.log(`Donasi baru dari ${donation.supporter_name}!`);
    console.log(`Pesan: ${donation.supporter_message}!`);
  });

  const myGoal = await client.getGoal();
  console.log(`Goal: ${myGoal.target}!`);
  console.log(`Target : ${myGoal.target}`);

  const leaderboard = await client.getLeaderboard();
  console.log(
    leaderboard.supporter.map(
      (supporter) => `${supporter.supporter_name}\n${supporter.sum}`
    )
  );

  const supporters = await client.getSupporter(10);
  if (supporters.length !== 0) {
    console.log(
      supporters.map(
        (supporter) =>
          `${supporter.display_name} mendonasikan ${supporter.quantity}`
      )
    );
  }
});
