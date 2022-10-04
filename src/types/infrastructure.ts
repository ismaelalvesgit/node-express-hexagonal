import { Knex } from "knex";
import { Channel, Options } from "amqplib";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { RedisClientOptions } from "redis";
import { IContactRepository } from "./contact";

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
  new(config?: RedisClientOptions): IRedisAdapter;
}

export interface IRedisAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, exp?: number): void;
  expire(key: string, seconds: number): void;
  delete(key: string): void;
}

/* Infrastructure */
export type Container = {
  contactRepository: IContactRepository;
};

export type ContainerConfig = {

};
