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
  protocol: env.amqp.protocol,
  hostname: env.amqp.host,
  port: env.amqp.port,
  username: env.amqp.user,
  password: env.amqp.password,
  vhost: env.amqp.vhost,
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
