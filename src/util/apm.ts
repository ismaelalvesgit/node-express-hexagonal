import apm from "elastic-apm-node";
import { Logger } from "./logger";
import { env } from "./env";

let elasticAgent: typeof apm | null = null;
if (env.apm.serverUrl) {
  elasticAgent = apm.start({
    serviceName: env.apm.serviceName,
    secretToken: env.apm.secretToken,
    apiKey: env.apm.apiKey,
    serverUrl: env.apm.serverUrl,
    cloudProvider: env.apm.cloudProvider
  });

  if (!elasticAgent.isStarted()) {
    Logger.info("Failed to start APM server");
  } else {
    Logger.info(`Registered service "${env.apm.serviceName}" in APM Server: ${env.apm.serverUrl}`);
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
