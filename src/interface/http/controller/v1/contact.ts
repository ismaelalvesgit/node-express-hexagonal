import httpStatus from "http-status-codes";
import { Logger } from "@util/logger";
import {
  IHttpRoute,
  HttpControllerConfig,
  HttpRouter,
  HttpRequest,
  HttpResponse,
} from "@type/interface";
import { createContactSchema, updateContactSchema } from "./schemas/contact";
import { cacheHandler } from "@middleware/cache";

export class ContactController implements IHttpRoute {
  private _validator: HttpControllerConfig["validator"];
  private _catchAsync: HttpControllerConfig["catchAsync"];
  private contactUseCase: HttpControllerConfig["coreContainer"]["contactUseCase"];
  private ctx: HttpControllerConfig["coreContainer"];

  constructor({
    coreContainer,
    validator,
    catchAsync
  }: HttpControllerConfig) {
    this.ctx = coreContainer;
    this.contactUseCase = coreContainer.contactUseCase;
    this._validator = validator;
    this._catchAsync = catchAsync;
  }

  register(r: HttpRouter) {
    r.route("/contact")
      .get(
        cacheHandler({ctx: this.ctx, path: "contact" }),
        this._catchAsync(
          this.find.bind(this)
        ),
      )
      .post(
        this._validator(createContactSchema),
        this._catchAsync(this.create.bind(this)),
      );
   
    r.route("/contact/:id")
      .put(
        this._validator(updateContactSchema),
        this._catchAsync(this.update.bind(this)),
      )
      .delete(
        this._catchAsync(this.delete.bind(this)),
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
    const data = await this.contactUseCase.find();
    res.status(httpStatus.OK).json(data);
  }

  async create(req: HttpRequest, res: HttpResponse) {
    const body = req.body;
    await this.contactUseCase.create(body);
    res.sendStatus(httpStatus.CREATED);
  }

  async update(req: HttpRequest, res: HttpResponse) {
    const id = req.params.id;
    const body = {...req.body, id};
    await this.contactUseCase.update(body);
    res.sendStatus(httpStatus.OK);
  }

  async delete(req: HttpRequest, res: HttpResponse) {
    const id = req.params.id;
    await this.contactUseCase.delete(Number(id));
    res.sendStatus(httpStatus.NO_CONTENT);
  }
}
