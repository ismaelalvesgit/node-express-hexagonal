import { Knex } from "knex";
import { Channel, Options } from "amqplib";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { RedisOptions } from "ioredis";

/* Http Adapter */
export interface IHttpAdapterConstructs {
  new(config: AxiosRequestConfig): IHttpAdapter;
}

export interface IHttpAdapter {
  send(config: AxiosRequestConfig): Promise<AxiosResponse>;
  send<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}

/* MySQL Adapter */
export type MysqlDatabase = Knex;

export type MysqlAdapterConfig = {
  dbConn: MysqlDatabase;
};

export interface IMysqlAdapter {
  db: Knex.QueryBuilder;
  tableName: string;
  knex: Knex;
}

/* Message Bus Adapter */
export type MessageBus = Channel;
export type MessageContent = unknown;
export type MessagePublishOptions = Options.Publish;

export interface IMessageBusAdapterConstructs {
  new(config?: MessageBusAdapterConfig): IMessageBusAdapter;
}

export enum MessageBusType {
  noConfirmation = 0,
  withConfirmation = 1,
}

export type MessageBusAdapterConfig = {
  messageBusType: MessageBusType;
};

export interface IMessageBusAdapter {
  publish(
    router: string,
    routingKey: string,
    content: MessageContent,
    options?: MessagePublishOptions,
  ): Promise<boolean>;
}

export interface IRedisAdapterConstructs {
  new(config?: RedisOptions): IRedisAdapter;
}

export interface IRedisAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, exp?: number): void;
  expire(key: string, seconds: number): void;
  delete(key: string): Promise<number>;
  deleteByPrefix(key: string): Promise<number[]>;
}

export type Env = {
  enviorement: string
  isProd: boolean
  timezone: string
  serviceName: string
  server: {
    url: string
    port: number
    bodyLimit: string
  }
  brasilApi?: string
  db: {
    host?: string
    port: number
    user?: string
    password?: string
    database?: string
    debug: boolean
    pool: {
      min: number
      max: number
    }
  }
  redis: {
    host?: string
    port: number
    db: number
    prefix: string
  }
  apm: {
    serverUrl?: string
    apiKey?: string
    secretToken?: string
    cloudProvider: string
  }
  amqp: {
    active: boolean
    protocol?: string
    host?: string
    port: number
    user?: string
    password?: string
    vhost?: string
    exchanges: Record<string, {key: string, routing: string}>
  }
  vault: {
    host?: string
    roleId?: string
    secretId?: string
  }
};
