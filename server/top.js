const express = require("express");
const topRouter = express.Router();
const db = require("./dbPool");
const ifOneLeague = require("./functions/ifOneLeague");
const ifAllLeagues = require("./functions/ifAllLeagues");

topRouter.get("/", (req, res) => {
  res.redirect("/top/100/latest");
});

topRouter.get("/:limit", (req, res) => {
  res.redirect(`/top/${req.params.limit}/latest`);
});

//localhost:5000/top/100/47/latest
//localhost:5000/top/100/all_leagues/latest

topRouter.get("/:limit/:league_id/:orderby", async (req, res) => {
  const league_id = req.params.league_id;
  let limit = req.params.limit;
  if (!req.params.limit) {
    limit = 100;
  }
  const client = await db.connect();
  try {
    let finalQuery;
    if (league_id >= 0) {
      finalQuery = await ifOneLeague(client, league_id, true);
    } else if (league_id == "all_leagues") {
      finalQuery = await ifAllLeagues(true);
    }
    switch (req.params.orderby) {
      case "fee": {
        finalQuery += ` ORDER BY fee DESC NULLS LAST LIMIT ${limit}`;
        break;
      }
      case "market_value": {
        finalQuery += ` ORDER BY market_value DESC NULLS LAST LIMIT ${limit}`;
        break;
      }
      default: {
        finalQuery += ` ORDER BY transfer_date DESC, time_added DESC LIMIT ${limit}`;
        break;
      }
    }
    const response = await client.query(finalQuery);
    res.json(response.rows);
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }
});

module.exports = topRouter;
