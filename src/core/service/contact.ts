import { ServiceContext } from "@type/core";
import { Contact, IContactService,  } from "@type/contact";

export class ContactService implements IContactService {
  private contactRepository: ServiceContext["contactRepository"];

  constructor(ctx: ServiceContext) {
    this.contactRepository = ctx.contactRepository;
  }

  public async find(): Promise<Array<Contact>> {
    return this.contactRepository.find();
  }

  public async asyncCreate(contact: Contact): Promise<void> {
    return this.contactRepository.asyncCreate(contact);
  }
  
  public async create(contact: Contact): Promise<void> {
    return this.contactRepository.create(contact);
  }

  public async update(contact: Contact): Promise<void> {
    return this.contactRepository.update(contact);
  }

  public async delete(contact: Contact): Promise<void> {
    return this.contactRepository.delete(contact);
  }
}
