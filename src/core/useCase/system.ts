import { ISystemUseCase, SystemMetric } from "@type/system";
import { UseCaseContext } from "@type/core";
import { IRedisAdapter } from "@type/infrastructure";

export class SystemUseCase implements ISystemUseCase {

  private systemService: UseCaseContext["systemService"];

  constructor(ctx: UseCaseContext) {
    this.systemService = ctx.systemService;
  }

  healthcheck(): Promise<void> {
    return this.systemService.healthcheck();
  }
  
  metrics(): Promise<SystemMetric> {
    return this.systemService.metrics();
  }

  metricExcludeUrl(){
    return this.systemService.metricExcludeUrl();
  }

  redis(): IRedisAdapter | null {
    return this.systemService.redis();
  }
}
