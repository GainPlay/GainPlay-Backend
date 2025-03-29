import * as winston from "winston";

const isProduction = process.env.NODE_ENV == "production";
export const logger = winston.createLogger({
  level: "http",
  defaultMeta: { service: "GainPlay" },
  transports: [new winston.transports.Console()],
  format: isProduction
    ? winston.format.json()
    : winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true }),
      ),
});
