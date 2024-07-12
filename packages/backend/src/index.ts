import compression from "compression";
import express, { json } from "express";
import helmet from "helmet";
import { logger } from "./logger";

import "express-async-errors";
import pinoHttp from "pino-http";

import { router } from "./generator";

const app = express();

app.use(helmet());
app.use(compression());
app.use(json());
app.use(pinoHttp({ logger }));

app.use("/api/generator", router);

const port = 3000;

app.listen(port, () => {
  console.log(`Express server started on port ${port}`);
});
