const manualToDb = require("./manualToDb");
const allLeagues = require("./allLeagues");
require("events").EventEmitter.defaultMaxListeners = 50;
const { Client } = require("pg");
const topLeagues = require("./topLeagues");
require("dotenv").config({
  path: ".env",
});
const client = new Client({
  host: process.env.HOST,
  user: process.env.USER,
  port: process.env.PORT,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

async function startingFile() {
  client.connect();
  let allTotalAdded = 0;
  let topTotalAdded = 0;
  try {
    console.log(
      "-------------------- STARTING ALL --------------------------------"
    );

    await Promise.all(
      allLeagues.map(async (league) => {
        // let time_added = Date.now();
        // time_added = new Date(new Date(time_added).toISOString());
        const addedEntries = await manualToDb(
          league.table,
          `https://www.fotmob.com/transfers?leagueIds=${league.id}`,
          league.id,
          client
        );
        console.log(
          `${league.name}: Added ${addedEntries} entries to ${league.name}...`
        );
        allTotalAdded += addedEntries;
        await new Promise((resolve) => setTimeout(resolve, 100));
      })
    );
    console.log(
      "-------------------- STARTING TOP --------------------------------"
    );
    await Promise.all(
      topLeagues.map(async (league) => {
        // let time_added = Date.now();
        // time_added = new Date(new Date(time_added).toISOString());
        const addedEntries = await manualToDb(
          league.table,
          `https://www.fotmob.com/transfers?showTop=true&leagueIds=${league.id}`,
          league.id,
          client
        );
        console.log(
          `TOP: ${league.name}: Added ${addedEntries} entries to ${league.name}...`
        );
        topTotalAdded += addedEntries;

        await new Promise((resolve) => setTimeout(resolve, 100));
      })
    );
    console.log("----------------------------------------------------------");
    console.log(`Total added ${allTotalAdded} to ALL `);
    console.log(`Total added ${topTotalAdded} to TOP `);

    console.log("ALL DONE");
  } catch (err) {
    console.log(err);
  } finally {
    client.end();
  }
}

startingFile();
