import httpStatus from "http-status-codes";
import { Logger } from "@util/logger";
import {
  IHttpRoute,
  HttpControllerConfig,
  HttpRouter,
  HttpRequest,
  HttpResponse,
  HttpNext
} from "@type/interface";


export class SystemController implements IHttpRoute {
  private _catchAsync: HttpControllerConfig["catchAsync"];
  private systemUseCase: HttpControllerConfig["coreContainer"]["systemUseCase"];

   constructor({
    coreContainer,
    catchAsync
  }: HttpControllerConfig) {
    this.systemUseCase = coreContainer.systemUseCase;
    this._catchAsync = catchAsync;
  }

  register(r: HttpRouter) {
    r.route("/system/healthcheck")
      .get(
        this._catchAsync(this.healthcheck.bind(this)),
      );
   
    r.route("/system/metrics")
      .get(
        this._catchAsync(this.metrics.bind(this)),
      );

    Logger.debug(
      {
        class: "ContactController",
        classType: "HttpController",
      },
      "route registration end",
    );
  }

  healthcheck(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    this.systemUseCase.healthcheck().then(() =>{
      res.sendStatus(httpStatus.OK);
    }).catch(next);
  }

  metrics(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    this.systemUseCase.metrics().then((metric) =>{
      const { metrics, contentType } = metric;
      res.set("Content-Type", contentType);
      res.send(metrics);
    }).catch(next);
  }
}
