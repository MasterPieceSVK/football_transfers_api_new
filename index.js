const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server listening on port " + PORT);
});

app.use(cors());

const mainRouter = require("./server/main");
app.use("/", mainRouter);

module.exports.handler = serverless(app);
