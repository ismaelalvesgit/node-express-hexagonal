import { ServiceContext } from "@type/core";
import { ISystemService, SystemMetric } from "@type/system";
import { env } from "@util/env";

export class SystemService implements ISystemService {
  private systemRepository: ServiceContext["systemRepository"];

  constructor(ctx: ServiceContext) {
    this.systemRepository = ctx.systemRepository;
  }
  
  healthcheck(): Promise<void> {
    return this.systemRepository.healthcheck();
  }

  metrics(): Promise<SystemMetric> {
    return this.systemRepository.metrics();
  }

  metricExcludeUrl(): string[] {
    return this.systemRepository.metricExcludeUrl();
  }

  redis() {
    if(env.get().redis.host){
      return this.systemRepository.redis();
    }
    return null;
  }
} 
