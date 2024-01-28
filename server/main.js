const express = require("express");
const apiRouter = express.Router();

apiRouter.get("/ping", (req, res) => {
  res.status(200).send();
});

apiRouter.get("/", (req, res) => {
  res.json({
    working: true,
  });
});
const allRouter = require("./all");
apiRouter.use("/all", allRouter);

const topRouter = require("./top");
apiRouter.use("/top", topRouter);

const getLeaguesRouter = require("./leagues");
apiRouter.use("/leagues", getLeaguesRouter);
module.exports = apiRouter;
