const express = require("express");
const app = express();
const readerControllers = require("./controllers/readers");

app.use(express.json());

app.post("/readers", readerControllers.create);

module.exports = app;
