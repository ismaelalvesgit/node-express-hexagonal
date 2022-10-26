import {
  Env,
  IRedisAdapter,
  IRedisAdapterConstructs,
} from "@type/infrastructure";
import { ISystemRepository, SystemMetric } from "@type/system";
import knex from "@util/knex";
import { register } from "prom-client";

export type Context = {
  config: Env;
  redisAdapter: IRedisAdapterConstructs;
};

export class SystemRepository implements ISystemRepository {
  private clientRedis: IRedisAdapter;

  constructor({ config,
    redisAdapter, }: Context) {
    this.clientRedis = new redisAdapter({
      host: config.redis.host,
      port: config.redis.port,
      db: config.redis.db,
      keyPrefix: config.redis.prefix
    });
  }

  healthcheck(): Promise<void> {
    return knex.raw("select 1+1 as result");
  }

  async metrics(): Promise<SystemMetric> {
    const metrics = await register.metrics();
    const contentType = register.contentType;
    return {
      metrics,
      contentType
    };
  }

  metricExcludeUrl(){
    return [
      "/",
      "/favicon.ico",
      "/system/metrics",
      "/system/healthcheck",
      "/v1/system/metrics",
      "/v1/system/healthcheck",
      "/v1/static/uploads/system/default.png"
    ];
  }

  redis(): IRedisAdapter {
    return this.clientRedis;
  }
}
