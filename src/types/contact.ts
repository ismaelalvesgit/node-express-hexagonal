export interface Contact {
  id: number
  name: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

export interface IContactRepository {
  find(): Promise<Array<Contact>>;
  create(contact: Contact): Promise<void>;
}

export interface IContactService {
  find(): Promise<Array<Contact>>;
  create(contact: Contact): Promise<void>;
}

export interface IContactUseCase {
  find(): Promise<Array<Contact>>;
  create(contact: Contact): Promise<void>;
}
