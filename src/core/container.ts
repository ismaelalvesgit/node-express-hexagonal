import { ContainerConfig, Container } from "@type/core";
import { ContactUseCase } from "./useCase/contact";
import { ContactService } from "./service/contact";
import { BrasilService } from "./service/brasil";
import { BrasilUseCase } from "./useCase/brasil";
import { SystemUseCase } from "./useCase/system";
import { SystemService } from "./service/system";

export function createContainer(config: ContainerConfig): Container {
  const serviceContext = {
    contactRepository: config.contactRepository,
    brasilRepository: config.brasilRepository,
    systemRepository: config.systemRepository,
  };

  const useCaseContext = {
    contactService: new ContactService(serviceContext),
    brasilService: new BrasilService(serviceContext),
    systemService: new SystemService(serviceContext),
  };

  return {
    contactUseCase: new ContactUseCase(useCaseContext),
    brasilUseCase: new BrasilUseCase(useCaseContext),
    systemUseCase: new SystemUseCase(useCaseContext)
  };
}
