import { AmqpInterface } from "./amqp";
import { HttpInterface } from "./http";

import {
  createContainer as createCoreContainer,
} from "../core/container";

import {
  createContainer as createInfraContainer,
} from "../infrastructure/container";

import {
  IHttpInterface,
  IAmqpInterface,
  ISocketInterface,
  ICronInterface,
} from "@type/interface";
import { Server } from "socket.io";
import { SocketInterface } from "./socket";
import { CronInterface } from "./cron";
import { Env } from "@type/infrastructure";

type ContainerConfig = {
  env: Env;
  init: {
    http?: boolean;
    amqp?: boolean;
    cli?: boolean;
    cron?: boolean;
    socket?: boolean;
  };
};

type Container = {
  httpInterface?: IHttpInterface;
  amqpInterface?: IAmqpInterface;
  cronInterface?: ICronInterface;
  socketInterface?: ISocketInterface;
};

export function createContainer(config: ContainerConfig): Container {
  const container: Container = {};
  const io = new Server({
    cors:{
      origin: "*",
    }
  });

  const infraContainer = createInfraContainer(config.env, io);
  const coreContainer = createCoreContainer(infraContainer);

  if (config.init.http) {
    container.httpInterface = new HttpInterface({
      env: config.env,
      coreContainer,
      io
    });
  }

  if(config.init.http && config.init.socket){
    container.socketInterface = new SocketInterface({
      env: config.env,
      coreContainer,
      io
    });
  }

  if (config.init.amqp) {
    container.amqpInterface = new AmqpInterface({
      env: config.env, 
      coreContainer
    });
  }

  if(config.init.cron){
    container.cronInterface = new CronInterface({
      env: config.env, 
      coreContainer
    });
  }

  return container;
}
