import { createClient, RedisClientOptions, RedisClientType } from "redis";
import { promisify } from "util";

export class RedisAdapter {
  protected readonly client: RedisClientType;

  constructor(public config?: RedisClientOptions) {
    this.client = createClient({
      url: config?.url,
      database: config?.database
    });
    this.client.connect();
  }

  get(key: string): Promise<string | null> {
    return promisify(this.client.get.bind(this.client))(key);
  }

  set(key: string, value: string, exp?: number): void {
    this.client.set.bind(this.client)(key, value);
    this.expire(key, exp ?? 86400);
  }

  expire(key: string, seconds: number): void {
    this.client.expire.bind(this.client)(key, seconds);
  }

  delete(key: string): void {
    this.client.del.bind(this.client)(key);
  }
}
