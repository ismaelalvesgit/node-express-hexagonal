import { AnySchema } from "joi";
import { UseCaseContext } from "@type/core";
import {
  InvalidProperties,
} from "@util/error";
import { cepSchema } from "./schemas/brasil";
import { Cep, IBrasilUseCase } from "@type/brasil";

export class BrasilUseCase implements IBrasilUseCase {
  private brasilService: UseCaseContext["brasilService"];

  constructor(ctx: UseCaseContext) {
    this.brasilService = ctx.brasilService;
  }

  private validateProperties({
    schema,
    params,
    errorMsg,
  }: {
    schema: AnySchema;
    params: object;
    errorMsg: string;
  }): void {
    const validation = schema.validate(params, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: false,
    });

    if (validation.error) {
      throw new InvalidProperties(errorMsg, validation.error.details);
    }
  }

  public async getCep(cep: number): Promise<Cep> {
    this.validateProperties({
      params: { cep },
      schema: cepSchema,
      errorMsg: "Invalid properties to get cep",
    });

    return this.brasilService.getCep(cep);
  }

}
