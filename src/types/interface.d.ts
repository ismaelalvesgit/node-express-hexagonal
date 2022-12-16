import {
  Router,
  Request,
  Response,
  NextFunction,
} from "express";
import { Channel, ConsumeMessage } from "amqplib";
import Validator from '@middleware/validator';
import CatchAsync from '@middleware/catchAsync';
import { Container } from "./core";
import { Server, Socket } from "socket.io";
import { FuncHandler } from '@amqp/middlewares/handlers'

declare module 'express-serve-static-core' {
  interface Request {
    requestId: string
  }
}

export interface IConfig {
  env: Env;
  coreContainer: Container;
  io?: Server
}

/* HTTP Interface */
export type HttpRouter = Router;
export type HttpRequest = Request;
export type HttpResponse = Response;
export type HttpNext = NextFunction;

export interface IHttpRoute {
  register(r: HttpRouter): void;
}

export interface IHttpInterface {
  serve(): void;
}

export type HttpControllerConfig = {
  coreContainer: Container;
  validator: Validator;
  catchAsync: CatchAsync;
};

/* AMQP Interface */
export type AmqpChannel = Channel;
export type AmqpMessage = ConsumeMessage;
export type AmqpParsedMessage<T> = Record<"content", T | undefined> & AmqpMessage;
export type AmqpMessageHandler = (msg: AmqpMessage | null) => void | Promise<void>;

export type AmqpOnConsumeFunction = (
  channel: AmqpChannel,
  finisher: FinisherFunction,
  ...msgHandlers: FuncHandler[]
) => (message: AmqpMessage | null) => Promise<void>;

export type FinisherFunction = (channel: AmqpChannel, message: AmqpMessage, error?: unknown) => unknown;

export interface IAmqpInterface {
  connect(): Promise<void>;
}

export interface ISocketInterface {
  connect(): void;
}

export interface IAmqpConsumer {
  assertQueue(channel: AmqpChannel): void;
}

export interface ISocketConsumer {
  init(): void;
}

export type AmqpConsumerConfig = {
  coreContainer: Container;
  _onConsume: AmqpOnConsumeFunction;
};

/* SOCKET Interface */
export type SocketConsumerConfig = {
  coreContainer: Container;
  socket: Socket
};

/* JOB Interface */
export interface ICronInterface {
  start(): void;
}

export type CronJobConfig = {
  coreContainer: Container;
};

export interface IJob {
  run(): void | Promise<void> | Promise<string>;
}

export interface ValidationParams {
  schema: AnySchema;
  params: object;
  errorMsg: string;
}
