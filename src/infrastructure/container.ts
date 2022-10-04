import { MysqlAdapter } from "./adapter/mysql";
import {
  ContainerConfig,
  Container,
} from "@type/infrastructure";
import { ContactRepository } from "./repository/contact";
import { Logger } from "@util/logger";
import { Server } from "socket.io";

export function createContainer(config: ContainerConfig, io?: Server): Container {
  Logger.info(config);
  return {
    contactRepository: new ContactRepository({
      mysqlAdapter: new MysqlAdapter(),
      socket: io
    }),
  };
}
