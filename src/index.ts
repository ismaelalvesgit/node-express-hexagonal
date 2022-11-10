import { env } from "@util/env";
import { Logger } from "@util/logger";
import Vault from "node-vault";
import R from "ramda";

const vault = Vault({
  apiVersion: "v1",
  endpoint: env.get().vault.host
});

setImmediate(async () => {
  if (R.keys(R.reject(R.isNil, env.get().vault)).length > 2) {
    Logger.info("Starting get secrets on vault");
    try {
      const result = await vault.approleLogin({
        role_id: env.get().vault.roleId,
        secret_id: env.get().vault.secretId,
      });

      vault.token = result.auth.client_token;
      const { data: { data } } = await vault.read(`secret/data/${env.get().serviceName}`);

      Logger.info("Secrets retrieve on vault", Object.keys(data));
      Object.keys(data).forEach((key) => {
        process.env[key] = data[key];
      });
    } catch (error) {
      const defaultMessage = "Failed to request secrets on vault";
      const message = R.pathOr(
        defaultMessage,
        ["response", "body", "errors"],
        error,
      );
      Logger.error(defaultMessage, message);
      throw error;
    }
  }

  require("app");
});
