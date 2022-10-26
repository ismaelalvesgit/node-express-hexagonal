import "./util/apm";
import { env } from "./util/env";
import { createContainer } from "./interface/container";
import { Logger } from "./util/logger";
import { collectDefaultMetrics } from "prom-client";
import Vault from 'node-vault'

type AppConfig = {
  http?: boolean;
  amqp?: boolean;
  socket?: boolean;
  cron?: boolean;
};

export class App {
  private _http?: boolean;
  private _amqp?: boolean;
  private _socket?: boolean;
  private _cron?: boolean;

  constructor({ http, amqp, socket, cron }: AppConfig) {
    this._http = http;
    this._amqp = amqp;
    this._socket = socket;
    this._cron = cron;
  }

  run() {
    const interfaceContainer = createContainer({
      env,
      init: {
        http: this._http,
        amqp: this._amqp,
        socket: this._socket,
        cron: this._cron
      },
    });

    if (this._http) {
      collectDefaultMetrics();
      interfaceContainer.httpInterface?.serve();
    }

    if (this._http && this._socket) {
      interfaceContainer.socketInterface?.connect();
    }

    if (this._amqp) {
      interfaceContainer.amqpInterface?.connect();
    }

    if(this._cron){
      interfaceContainer.cronInterface?.start();
    }
  }

  async secret(){
    const vault = Vault({
      apiVersion: "v1",
      endpoint: env.vault.host
    })

    const result = await vault.approleLogin({
      role_id: env.vault.roleId,
      secret_id:  env.vault.secretId,
    });

    vault.token = result.auth.client_token

    const { data: { data } } = await vault.read(`secret/data/${env.serviceName}`);
    console.log(data)
    Object.keys(data).forEach((key)=>{
      process.env[key] = data[key]
    })
  }
}

const app = new App({
  http: true,
  socket: true,
  cron: true,
  amqp: env.amqp.active,
});

setImmediate(() => {
  app.secret().then(()=>{
    app.run();
  });
  Logger.info(`Server on http://localhost:${env.server.port}`);
});
