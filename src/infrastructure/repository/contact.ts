import {
  IMysqlAdapter,
} from "@type/infrastructure";
import { Contact, IContactRepository } from "@type/contact";
import { Server } from "socket.io";

export type Context = {
  mysqlAdapter: IMysqlAdapter;
  socket?: Server;
};

export class ContactRepository implements IContactRepository {
  private mysqlAdapter: Context["mysqlAdapter"];
  private socket?: Context["socket"];

  constructor({ mysqlAdapter, socket }: Context) {
    this.mysqlAdapter = mysqlAdapter;
    this.mysqlAdapter.tableName = "contact";
    this.socket = socket;
  }

  public async find(): Promise<Contact[]> {
    return this.mysqlAdapter.db;
  }

  public async create(contact: Contact): Promise<void> {
    await this.mysqlAdapter.db.insert(contact);
    this.socket?.emit("/contact", contact);
  }

  public async update(contact: Contact): Promise<void> {
    await this.mysqlAdapter.db
    .where({id: contact.id})
    .update(contact);
  }

  public async delete(contact: Contact): Promise<void> {
    await this.mysqlAdapter.db
    .where({id: contact.id})
    .del();
  }

}
