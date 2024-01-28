const express = require("express");
const getLeaguesRouter = express.Router();
const allLeagues = require("../transferGrabberFunctions/allLeagues");

getLeaguesRouter.get("/", (req, res) => {
  const simplifiedLeagues = allLeagues.map((league) => {
    return {
      name: league.name,
      id: league.id,
    };
  });

  res.json(simplifiedLeagues);
});

module.exports = getLeaguesRouter;
