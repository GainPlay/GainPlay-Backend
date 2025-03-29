import * as morgan from "morgan";
import { logger } from "@/common/helpers/logs";

export const morganLogger = morgan((tokens: any, req: any, res: any) => {
  logger.http("http request", {
    route: tokens.url(req, res),
    method: tokens.method(req, res),
    status: Number(tokens.status(req, res)),
    responseTime: Number(tokens["response-time"](req, res)),
    latency: Number(tokens.res(req, res, "content-length") ?? 0),
  });
});
