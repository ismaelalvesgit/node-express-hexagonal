import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
} from "axios";
import { AxiosLogger } from "@util/logger";
import { IHttpAdapter } from "@type/infrastructure";

export class HttpAdapter implements IHttpAdapter {
  private instance: AxiosInstance;

  constructor(public config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    AxiosLogger.attachInterceptor.bind(AxiosLogger)(this.instance);
  }

  send(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }
}
