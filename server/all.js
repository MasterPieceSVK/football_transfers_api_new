const express = require("express");
const allRouter = express.Router();
const db = require("./dbPool");
const ifOneLeague = require("./functions/ifOneLeague");
const ifAllLeagues = require("./functions/ifAllLeagues");

allRouter.get("/", (req, res) => {
  res.redirect("/all/100/latest");
});

allRouter.get("/:limit", (req, res) => {
  res.redirect(`/all/${req.params.limit}/all_leagues/latest`);
});

//localhost:5000/all/100/47/latest
//localhost:5000/all/100/all_leagues/latest
allRouter.get("/:limit/:league_id/", async (req, res) => {
  res.redirect(`/all/${req.params.limit}/${req.params.league_id}/latest`);
});
allRouter.get("/:limit/:league_id/:orderby", async (req, res) => {
  const league_id = req.params.league_id;
  let limit = req.params.limit;
  if (!req.params.limit) {
    limit = 100;
  }
  const client = await db.connect();
  try {
    let finalQuery;
    if (league_id >= 0) {
      finalQuery = await ifOneLeague(client, league_id, false);
    } else if (league_id == "all_leagues") {
      finalQuery = await ifAllLeagues(false);
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
        finalQuery += ` ORDER BY transfer_date DESC ,time_added DESC LIMIT ${limit}`;
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

module.exports = allRouter;
