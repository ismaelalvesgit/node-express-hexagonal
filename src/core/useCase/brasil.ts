import { UseCaseContext } from "@type/core";
import { cepSchema } from "./schemas/brasil";
import { Cep, IBrasilUseCase } from "@type/brasil";
import validateProperties from "@util/validation";

export class BrasilUseCase implements IBrasilUseCase {
  private brasilService: UseCaseContext["brasilService"];

  constructor(ctx: UseCaseContext) {
    this.brasilService = ctx.brasilService;
  }

  public async getCep(cep: number): Promise<Cep> {
    validateProperties({
      params: { cep },
      schema: cepSchema,
      errorMsg: "Invalid properties to get cep",
    });

    return this.brasilService.getCep(cep);
  }

}
