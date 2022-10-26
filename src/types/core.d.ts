import { IBrasilService, IBrasilUseCase, } from "./brasil";
import { IContactService, IContactUseCase } from "./contact";
import { ISystemService, ISystemUseCase } from "./system";
import { Container as infraContainer } from "./infrastructure";
import { IJob } from "./interface";

export type Container = {
  contactUseCase: IContactUseCase;
  brasilUseCase: IBrasilUseCase;
  systemUseCase: ISystemUseCase;
};

export type ContainerConfig = {
  contactRepository: infraContainer["contactRepository"];
  brasilRepository: infraContainer["brasilRepository"];
  systemRepository: infraContainer["systemRepository"];
};

export type ServiceContext = ContainerConfig;

export type UseCaseContext = {
  contactService: IContactService;
  brasilService: IBrasilService;
  systemService: ISystemService;
};

export type AddCommands = {
  job: new ({ coreContainer }: CronJobConfig) => IJob;
  name: string;
  group: string;
  schedule: string;
  deadline: number;
};

export type Commands = {
  command: () => Promise<string>;
  name: string;
  group: "second" | "minute" | "day" | "hour" | "month" | "year";
  schedule: string;
  deadline: number;
};
