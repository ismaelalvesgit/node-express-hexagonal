import { init } from "@ismaelalves/logger";
import { env } from "./env";

export const {
  AxiosLogger,
  ExpressLogger,
  Logger,
  Redact,
  RequestLogger
} = init({
  PROJECT_NAME: env.get().serviceName,
  LOG_LEVEL: env.get().enviorement === "test" ? "fatal" : "debug",
  OMIT_ROUTES: [
    "/v1/system/metrics"
  ]
});

