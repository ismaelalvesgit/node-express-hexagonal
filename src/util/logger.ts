import { init } from "@somosphi/logger";
import { env } from "./env";

export const {
  AxiosLogger,
  ExpressLogger,
  Logger,
  Redact,
} = init({
  PROJECT_NAME: "contact",
  LOG_LEVEL: env.enviorement === "test" ? "fatal" : "debug",
});
