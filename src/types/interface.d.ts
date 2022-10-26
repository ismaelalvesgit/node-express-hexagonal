import {
  Router,
  Request,
  Response,
  NextFunction,
} from "express";
import { Channel, ConsumeMessage } from "amqplib";

import { Container } from "./core";
import { Server, Socket } from "socket.io";

declare module 'express-serve-static-core' {
  interface Request {
    requestId: string
  }
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
  validator: typeof import("../interface/http/middleware/validator").validator;
  catchAsync: typeof import("../interface/http/middleware/catchAsync").default;
};

/* AMQP Interface */
export type AmqpChannel = Channel;
export type AmqpMessage = ConsumeMessage;
export type AmqpParsedMessage<T> = Record<"content", T | undefined> & AmqpMessage;
export type AmqpMessageHandler = (msg: AmqpMessage | null) => void | Promise<void>;

export type AmqpOnConsumeFunction = (
  channel: AmqpChannel,
  finisher: FinisherFunction,
  ...msgHandlers: import("../interface/amqp/middlewares/handlers").FuncHandler[]
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

export type SocketConsumerConfig = {
  coreContainer: Container;
  socket: Socket
};

export interface ICronInterface {
  start(): void;
}

export type CronJobConfig = {
  coreContainer: Container;
};

export interface IJob {
  run(): void | Promise<void> | Promise<string>;
}