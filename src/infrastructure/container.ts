import { MysqlAdapter } from "./adapter/mysql";
import {
  Env,
} from "@type/infrastructure";
import { ContactRepository } from "./repository/contact";
import { Server } from "socket.io";
import { BrasilRepository } from "@repository/brasil";
import { HttpAdapter } from "@adapter/http";
import { SystemRepository } from "@repository/system";
import { RedisAdapter } from "@adapter/redis";
import { ContainerConfig } from "@type/core";
import { MessageBusAdapter } from "@adapter/messageBus";

export function createContainer(config: Env, io?: Server): ContainerConfig {
  return {
    contactRepository: new ContactRepository({
      mysqlAdapter: new MysqlAdapter(),
      socket: io,
      messageBusAdapter: MessageBusAdapter,
    }),
    brasilRepository: new BrasilRepository({
      config,
      httpAdapter: HttpAdapter
    }),
    systemRepository: new SystemRepository({
      config,
      redisAdapter: RedisAdapter
    })
  };
}
