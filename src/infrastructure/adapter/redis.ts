import { IRedisAdapter } from "@type/infrastructure";
import { env } from "@util/env";
import Redis from "ioredis";

export class RedisAdapter implements IRedisAdapter {
  protected readonly client: Redis.Redis;
  protected readonly timeDay = 86400;

  constructor(public config?: Redis.RedisOptions) {
    this.client = new Redis(config);
  }

  async get(key: string): Promise<string | null> {
    const data = await this.client.get.bind(this.client)(key);
    try {
      return JSON.parse(data || "");
    } catch (error) {
      return data;
    }
  }

  set(key: string, value: string, exp?: number): void {
    this.client.set.bind(this.client)(key, value);
    this.expire(key, exp ?? this.timeDay);
  }

  expire(key: string, seconds: number): void {
    this.client.expire.bind(this.client)(key, seconds);
  }

  delete(key: string) {
    return this.client.del.bind(this.client)(key);
  }

  async deleteByPrefix(prefix: string){
    const keys = await this.client.keys.bind(this.client)(`${env.get().redis.prefix}${prefix}:*`);
    return Promise.all(keys.map((key)=>{
      return this.delete(key.split(env.get().redis.prefix)[1]);
    }));
  } 
}
