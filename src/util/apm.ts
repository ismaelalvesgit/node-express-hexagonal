import apm from "elastic-apm-node";
import { Logger } from "./logger";
import { env } from "./env";

let elasticAgent: typeof apm | null = null;
if (env.get().apm.serverUrl) {
  elasticAgent = apm.start({
    serviceName: env.get().serviceName,
    secretToken: env.get().apm.secretToken,
    apiKey: env.get().apm.apiKey,
    serverUrl: env.get().apm.serverUrl,
    cloudProvider: env.get().apm.cloudProvider
  });

  if (!elasticAgent.isStarted()) {
    Logger.info("Failed to start APM server");
  } else {
    Logger.info(`Registered service "${env.get().serviceName}" in APM Server: ${env.get().apm.serverUrl}`);
  }
}

export function getAgent(): typeof apm {
  return elasticAgent!;
}

export function setApmTransactionResult(transaction: apm.Transaction | null, result: string | number){
  if(transaction){
    transaction.result = result;
  }
}
