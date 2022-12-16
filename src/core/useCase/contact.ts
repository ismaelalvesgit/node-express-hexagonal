import { UseCaseContext } from "@type/core";
import { Contact, IContactUseCase } from "@type/contact";
import { createContactSchema } from "./schemas/contact";
import validateProperties from "@util/validation";

export class ContactUseCase implements IContactUseCase {
  private contactService: UseCaseContext["contactService"];
  private systemService: UseCaseContext["systemService"];

  constructor(ctx: UseCaseContext) {
    this.contactService = ctx.contactService;
    this.systemService = ctx.systemService;
  }

  public async find(): Promise<Array<any>> {
    return this.contactService.find();
  }

  public async asyncCreate(contact: Contact): Promise<void> {
    validateProperties({
      params: contact,
      schema: createContactSchema,
      errorMsg: "Invalid properties to create contact",
    });

    await this.contactService.asyncCreate(contact);
  }

  public async create(contact: Contact): Promise<void> {
    validateProperties({
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
