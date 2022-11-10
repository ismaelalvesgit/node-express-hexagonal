import {
  connect,
  Channel,
  ConfirmChannel,
  Connection,
  Options,
} from "amqplib";

import { env } from "./env";

// TODO handle channel close
// TODO handle reconnection
const config: Options.Connect = {
  protocol: env.get().amqp.protocol,
  hostname: env.get().amqp.host,
  port: env.get().amqp.port,
  username: env.get().amqp.user,
  password: env.get().amqp.password,
  vhost: env.get().amqp.vhost,
};

let connection: Connection;
const _getConnection = async () => {
  if (!connection) {
    connection = await connect(config);
  }
  return connection;
};

async function getChannel(): Promise<Channel> {
  const conn = await _getConnection();
  const channel = await conn.createChannel();

  return channel;
}

async function getConfirmChannel(): Promise<ConfirmChannel> {
  const conn = await _getConnection();
  const channel = await conn.createConfirmChannel();

  return channel;
}

export {
  getChannel,
  getConfirmChannel,
};
