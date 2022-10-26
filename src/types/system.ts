import { IRedisAdapter } from "./infrastructure";

export interface SystemMetric {
  metrics: string
  contentType: string
}

export interface ISystemRepository {
  healthcheck(): Promise<void>;
  metrics(): Promise<SystemMetric>
  metricExcludeUrl(): string[]
  redis(): IRedisAdapter
}

export interface ISystemService {
  healthcheck(): Promise<void>;
  metrics(): Promise<SystemMetric>
  metricExcludeUrl(): string[]
  redis(): IRedisAdapter | null
}

export interface ISystemUseCase {
  healthcheck(): Promise<void>;
  metrics(): Promise<SystemMetric>
  metricExcludeUrl(): string[]
  redis(): IRedisAdapter | null
}
