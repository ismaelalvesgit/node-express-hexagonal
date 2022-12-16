import helmet, { hsts } from "helmet";
import cors from "cors";
import express from "express";
import xssFilter from "x-xss-protection";
import responseTime from "response-time";
import swagger from "swagger-ui-express";
import YAML from "yamljs";
import http from "http";
import hidePoweredBy from "hide-powered-by";
import { Server } from "socket.io";
import { errorHandler } from "./middleware/errorHandler";
import { IConfig, IHttpInterface } from "@type/interface";
import { ExpressLogger, Logger } from "@util/logger";
import requestIdHandler from "@middleware/requestId";
import limteRate from "@middleware/limteRate";
import requestCountersHandler from "@middleware/metrics/requestCounters";
import responseCountersHandler from "@middleware/metrics/responseCounters";
import changeLocaleHandler from "@middleware/changeLocale";
import i18n from "@middleware/i18n";
import { HttpRouter } from "@controller/routes";
const swaggerDocument = YAML.load("./doc/swagger.yml");

export class HttpInterface implements IHttpInterface {
  private io?: Server;
  private app: express.Application;
  private coreContainer: IConfig["coreContainer"];
  private env: IConfig["env"];
  private httpServer: http.Server;

  constructor(config: IConfig) {
    Logger.debug({
      coreContainer: config.coreContainer !== undefined,
      env: config.env !== undefined,
      io: config.io !== undefined,
    }, "fun: HttpInterface.constructor");

    this.coreContainer = config.coreContainer;
    this.env = config.env;
    this.io = config.io;
    this.app = express();
    this.httpServer = http.createServer(this.app); 
  }

  // eslint-disable-next-line class-methods-use-this
  private _debug(info: object = {}, msg: string = "") {
    Logger.debug({
      class: "HttpInterface",
      classType: "Interface",
      ...info,
    }, msg);
  }

  initApp() {
    this.app.use(
      helmet({
        contentSecurityPolicy: this.env.isProd,
      }),
      cors(),
      express.json({limit: this.env.server.bodyLimit}),
      express.urlencoded({extended: true}),
      hsts({
        maxAge: 31536000,
        includeSubDomains: true, 
        preload: true
      }),
      xssFilter(),
      hidePoweredBy(),
      requestIdHandler,
      i18n.init,
      changeLocaleHandler,
      requestCountersHandler(this.coreContainer),
      responseCountersHandler(this.coreContainer),
      responseTime(),
      limteRate()
    );

    this.setupEngineView();
    
    this.setupDoc();
    
    this.setupAssets();

    this.app.use(ExpressLogger.onSuccess.bind(ExpressLogger));
    this.app.use(ExpressLogger.onError.bind(ExpressLogger));

    this.setupRoutes();
    
    this.app.use(errorHandler);
  }

  setupRoutes() {
    const router = new HttpRouter({
      app: this.app,
      coreContainer: this.coreContainer
    });
    router.v1();
    this.app.get("/", (req, res)=>{
      res.render("index", {url: this.env.server.url});
    });
    this.setupNotFound();

    this._debug({}, "setupRoutes end");
  }

  setupNotFound() {
    this.app.all(
      "*",
      (req: express.Request, res: express.Response ) => {
        res.status(501).json({message: req.__("ServiceUnavailable.router")});
      },
    );
  }

  setupDoc(){
    this.app.use("/v1/api-doc", swagger.serve, swagger.setup(swaggerDocument));
  }

  setupAssets(){  
    this.app.use("/static", express.static("./src/public"));
  }

  setupEngineView(){
    this.app.set("view engine", "ejs");
    this.app.set("views", "./src/views");
  }

  serve() {
    this.initApp();
    
    this.io?.listen(this.httpServer);

    this.httpServer.listen(this.env.server.port);

    this._debug({}, "http interface initialized");
  }
}
