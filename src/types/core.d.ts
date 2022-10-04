import { IContactService, IContactUseCase } from "./contact";
import { Container as infraContainer } from "./infrastructure";
import { IJob } from "./interface";

export type Container = {
  contactUseCase: IContactUseCase;
};

export type ContainerConfig = {
  contactRepository: infraContainer["contactRepository"];
};

export type ServiceContext = {
  contactRepository: ContainerConfig["contactRepository"];
};

export type UseCaseContext = {
  contactService: IContactService;
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
