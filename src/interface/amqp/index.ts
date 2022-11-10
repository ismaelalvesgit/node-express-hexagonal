import { Container } from "@type/core";
import { getChannel } from "@util/amqplib";
import { Logger } from "@util/logger";
import {
  IAmqpConsumer,
  AmqpChannel,
  IAmqpInterface,
} from "@type/interface";
import { ContactConsumer } from "./consumer/contact";
import { onConsume } from "./middlewares/onConsume";
import { Env } from "@type/infrastructure";

type Config = {
  env: Env;
  coreContainer: Container;
};

export class AmqpInterface implements IAmqpInterface {
  private channel: AmqpChannel | null;
  private coreContainer: Config["coreContainer"];

  constructor(config: Config) {
    this.coreContainer = config.coreContainer;
    this.channel = null;
  }

  private async getChannel(): Promise<AmqpChannel> {
    if (this.channel === null) {
      this.channel = await getChannel();
    }
    return this.channel;
  }

  private async connectConsumers(): Promise<void> {
    const channel = await this.getChannel();

    [
      new ContactConsumer({
        coreContainer: this.coreContainer,
        _onConsume: onConsume
      })
    ].forEach((consumer: IAmqpConsumer) => {
      consumer.assertQueue(channel);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private _debug(info: object = {}, msg: string = "") {
    Logger.debug({
      class: "AmqpInterface",
      classType: "Interface",
      ...info,
    }, msg);
  }

  async connect(): Promise<void> {
    await this.connectConsumers();
    this._debug({}, "amqp interface initialized");
  }
}
