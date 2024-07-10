import { HelloWorld } from "@p1223/shared";
import compression from "compression";
import express, { json } from "express";
import helmet from "helmet";

import "express-async-errors";

const app = express();

app.use(helmet());
app.use(compression());
app.use(json());

app.get("/api/", async (_req, res) => {
  const reply: HelloWorld = { msg: "Hello World" };
  res.send(reply);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Express server started on port ${port}`);
});
