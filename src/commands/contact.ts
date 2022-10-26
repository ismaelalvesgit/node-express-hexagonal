import { Contact } from "@type/contact";
import { CronJobConfig, IJob } from "@type/interface";

const name = "contact-create";
const group = "minute";
const schedule = "*/10 * * * *";
const deadline = 180;

const job = class ContactJob implements IJob {
    private contactUseCase: CronJobConfig["coreContainer"]["contactUseCase"];

    constructor({ coreContainer }: CronJobConfig) {
      this.contactUseCase = coreContainer.contactUseCase;
    }

    async run() {
        const contact = {
            name: "ismael",
            phone: new Date().getTime().toString()
        } as Contact;
        await this.contactUseCase.create(contact);
    }
};

export {
    job,
    name,
    group,
    schedule,
    deadline,
};