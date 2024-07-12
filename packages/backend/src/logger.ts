import pino from "pino";

const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
    },
  ],
});

export const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);
