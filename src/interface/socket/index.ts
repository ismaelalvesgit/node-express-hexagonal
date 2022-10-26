import { Server } from "socket.io";
import { Logger } from "@util/logger";
import { ISocketInterface } from "@type/interface";
import { ContactSocketConsume } from "./consumers/contact";
import realIp from "./middlewares/realIpMiddleware";
import { Container } from "@type/core";

type Config = {
    env: typeof import("@util/env").env;
    coreContainer: Container;
    io?: Server
};
  
export class SocketInterface implements ISocketInterface {
    private io?: Server;
    private coreContainer: Config["coreContainer"];

    constructor(config: Config){
        this.coreContainer = config.coreContainer;
        this.io = config.io;
    }

    private connectConsumers() {
        this.io?.on("connection", socket =>{
            [
                new ContactSocketConsume({
                    coreContainer: this.coreContainer,
                    socket 
                })
            ].forEach((consume)=>{
                consume.init();
            });
        });
    }

    private setup(){
        this.io?.use(realIp);
    }

    private _debug(info: object = {}, msg: string = "") {
        Logger.debug({
          class: "SocketInterface",
          classType: "Interface",
          ...info,
        }, msg);
    }

    connect(){
        this.setup();
        this.connectConsumers();
        this._debug({}, "Socket interface initialized");
    }
}