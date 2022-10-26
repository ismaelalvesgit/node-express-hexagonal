import { AnySchema } from "joi";
import { UseCaseContext } from "@type/core";
import { Contact, IContactUseCase } from "@type/contact";
import {
  InvalidProperties,
} from "@util/error";
import { createContactSchema } from "./schemas/contact";

export class ContactUseCase implements IContactUseCase {
  private contactService: UseCaseContext["contactService"];
  private systemService: UseCaseContext["systemService"];

  constructor(ctx: UseCaseContext) {
    this.contactService = ctx.contactService;
    this.systemService = ctx.systemService;
  }

  private validateProperties({
    schema,
    params,
    errorMsg,
  }: {
    schema: AnySchema;
    params: object;
    errorMsg: string;
  }): void {
    const validation = schema.validate(params, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: false,
    });

    if (validation.error) {
      throw new InvalidProperties(errorMsg, validation.error.details);
    }
  }

  public async find(): Promise<Array<any>> {
    return this.contactService.find();
  }

  public async create(contact: Contact): Promise<void> {
    this.validateProperties({
      params: contact,
      schema: createContactSchema,
      errorMsg: "Invalid properties to create contact",
    });

    await this.contactService.create(contact);
    this.systemService.redis()?.deleteByPrefix("contact");
  }
  
  public async update(contact: Contact): Promise<void> {
    await this.contactService.update(contact);
    this.systemService.redis()?.deleteByPrefix("contact");
  }
  
  public async delete(id: number): Promise<void> {
    const contact = { id } as Contact;
    await this.contactService.delete(contact);
    this.systemService.redis()?.deleteByPrefix("contact");
  }
}
