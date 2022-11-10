import { createContainer } from "./interface/container";
import { Logger } from "./util/logger";
import { env } from "@util/env";

type AppConfig = {
  http?: boolean;
  amqp?: boolean;
  cron?: boolean;
};

export class App {
  private _http?: boolean;
  private _amqp?: boolean;
  private _cron?: boolean;

  constructor({ http, amqp, cron }: AppConfig) {
    this._http = http;
    this._amqp = amqp;
    this._cron = cron;
  }

  run() {
    const interfaceContainer = createContainer({
      env: env.get(),
      init: {
        http: this._http,
        amqp: this._amqp,
        cron: this._cron
      },
    });

    if (this._http) {
      interfaceContainer.httpInterface?.serve();
    }

    if (this._amqp) {
      interfaceContainer.amqpInterface?.connect();
    }

    if (this._cron) {
      interfaceContainer.cronInterface?.start();
    }
  }
}

const app = new App({
  http: true,
  amqp: env.get().amqp.active,
});

setImmediate(() => {
  app.run();
  Logger.info(`Server on http://localhost:${env.get().server.port}`);
});
