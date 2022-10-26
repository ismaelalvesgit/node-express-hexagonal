import httpStatus from "http-status-codes";
import { Logger } from "@util/logger";
import {
  IHttpRoute,
  HttpControllerConfig,
  HttpRouter,
  HttpRequest,
  HttpResponse,
} from "@type/interface";

export class BrasilController implements IHttpRoute {
  private _catchAsync: HttpControllerConfig["catchAsync"];
  private brasilUseCase: HttpControllerConfig["coreContainer"]["brasilUseCase"];

  constructor({
    coreContainer,
    catchAsync
  }: HttpControllerConfig) {
    this.brasilUseCase = coreContainer.brasilUseCase;
    this._catchAsync = catchAsync;
  }

  register(r: HttpRouter) {
    r.route("/cep/:cep")
      .get(
        this._catchAsync(this.find.bind(this)),
      );

    Logger.debug(
      {
        class: "ContactController",
        classType: "HttpController",
      },
      "route registration end",
    );
  }

  async find(req: HttpRequest, res: HttpResponse) {
    const { cep } = req.params;
    const data = await this.brasilUseCase.getCep(Number(cep));
    res.status(httpStatus.OK).json(data);
  }
}
