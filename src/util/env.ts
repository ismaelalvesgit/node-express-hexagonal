import { Env } from "@type/infrastructure";
import dotenv from "dotenv";
import path from "path";

const enviorement = process.env.NODE_ENV ? `../../.env.${process.env.NODE_ENV}` : "../../.env";
dotenv.config({ path: path.join(__dirname, enviorement) });

const url = process.env.SERVER_URL || "http://localhost:3000";

class ConfigEnv {
    get(): Env{
        return {
            enviorement: process.env.NODE_ENV || "development",
            isProd: process.env.NODE_ENV === "production",
            timezone: process.env.TZ || "America/Fortaleza",
            serviceName: process.env.SERVICE_NAME || "example",
            server: {
                url,
                port: parseInt(process.env.SERVER_PORT || "3000"),
                bodyLimit: process.env.SERVER_BODY_LIMIT || "500kb"
            },
            brasilApi: process.env.BRASIL_API || "",
            db: {
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || "3306"),
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                debug: process.env.DB_DEBUG === "true",
                pool: {
                    min: parseInt(process.env.DB_POOL_MIN || "1"),
                    max: parseInt(process.env.DB_POOL_MAX || "10"),
                }
            },
            redis: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT || "6379"),
                db: parseInt(process.env.REDIS_DB || "0"),
                prefix: process.env.REDIS_PREFIX || "example:"
            },
            apm: {
                serverUrl: process.env.APM_SERVER_URL,
                apiKey: process.env.APM_API_KEY,
                secretToken: process.env.APM_SECRET_TOKEN,
                cloudProvider: process.env.APM_CLOUND_PROVIDER || "none"
            },
            amqp: {
                active: process.env.AMQP_ACTIVE === "true",
                protocol: process.env.AMQP_PROTOCOL,
                host: process.env.AMQP_HOSTNAME,
                port: parseInt(process.env.AMQP_PORT || "5672"),
                user: process.env.AMQP_USERNAME,
                password: process.env.AMQP_PASSWORD,
                vhost: process.env.AMQP_VHOST,
                exchanges: {
                    example: {
                        key: "example-create",
                        routing: "operations-create"
                    }
                }
            },
            vault: {
                host: process.env.VAULT_URL,
                roleId: process.env.VAULT_ROLE_ID,
                secretId: process.env.VAULT_SECRET_ID
            },
        };
    }
}

const env = new ConfigEnv();

export { env };
