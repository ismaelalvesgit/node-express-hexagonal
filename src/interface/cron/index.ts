import { Container } from "@type/core";
import { ICronInterface } from "@type/interface";
import { Logger } from "@util/logger";
import { CronJob } from "cron";
import { v4 } from "uuid";
import { getAgent, setApmTransactionResult } from "@util/apm";
import commands from "@command/index";
import { Env } from "@type/infrastructure";

type Config = {
    env: Env;
    coreContainer: Container;
};
  
export class CronInterface implements ICronInterface {
    private env: Config["env"];
    private coreContainer: Config["coreContainer"];

    constructor(config: Config) {
        this.env = config.env;
        this.coreContainer = config.coreContainer;
    }   

    private _debug(info: object = {}, msg: string = "") {
        Logger.debug({
          class: "CronInterface",
          classType: "Interface",
          ...info,
        }, msg);
    }

    start(): void {
        const jobs = [] as Array<CronJob>;
        commands(this.coreContainer).forEach((job)=>{
            const uuid = v4();
            const instance = `${uuid} ${job.name}`;
            const trans = getAgent().startTransaction(instance);
            const cron = new CronJob(job.schedule, async()=>{
                try {
                    if(!this.env.isProd || job.group === "second"){
                        Logger.info(`Initialized job ${instance}`);
                        await job.command();
                    }
                    setApmTransactionResult(trans, "success");
                    Logger.info(`End job ${instance}`);
                } catch (error: any) {
                    setApmTransactionResult(trans, "error");
                    getAgent().captureError(error, () => {
                        Logger.error(`Send APM: ${error.message}`);
                    });
                }
                trans?.end();
            });
            jobs.push(cron);
        });

        jobs
          .filter((job) => !job.running)
          .forEach((job) => job.start());

        this._debug({}, "Cron interface initialized");
        Logger.debug(`Running ${jobs.length} jobs`);
    }
}