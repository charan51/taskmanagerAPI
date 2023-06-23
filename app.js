const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8081;
const taksRouter = require("./router/task.router");
app.use(bodyParser.json());
app.use("/task", taksRouter);
app.listen(port, () => {
  console.log("Port is running on:: ", port);
});
