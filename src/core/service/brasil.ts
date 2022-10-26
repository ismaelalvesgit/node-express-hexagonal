import { ServiceContext } from "@type/core";
import { Cep, IBrasilService,  } from "@type/brasil";

export class BrasilService implements IBrasilService {
  private brasilRepository: ServiceContext["brasilRepository"];

  constructor(ctx: ServiceContext) {
    this.brasilRepository = ctx.brasilRepository;
  }

  public async getCep(cep: number): Promise<Cep> {
    return this.brasilRepository.getCep(cep);
  }

}
