import {
  Env,
  IHttpAdapter,
  IHttpAdapterConstructs,
} from "@type/infrastructure";
import { Cep, IBrasilRepository } from "@type/brasil";
import { BadRequest } from "@util/error";
import R from "ramda";

export type Context = {
  config: Env;
  httpAdapter: IHttpAdapterConstructs;
};

export class BrasilRepository implements IBrasilRepository {
  private clientHttp: IHttpAdapter;

  constructor({ config,
    httpAdapter, }: Context) {
    this.clientHttp = new httpAdapter({
      baseURL: config.brasilApi,
    });
  }

  public async getCep(cep: number): Promise<Cep> {
    try {
      const { data } = await this.clientHttp.send<Cep>({
        url: `/api/cep/v2/${cep}`,
        method: "GET"
      });
      return data;
    } catch (error) {
      const defaultMessage = "Failed to request cep";
      const message = R.pathOr(
        defaultMessage,
        ["response", "data", "message"],
        error,
      );
      throw new BadRequest(message);
    }
  }

}
