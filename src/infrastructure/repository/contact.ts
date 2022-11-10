import {
  IMessageBusAdapter,
  IMessageBusAdapterConstructs,
  IMysqlAdapter,
} from "@type/infrastructure";
import { Contact, IContactRepository } from "@type/contact";
import { Server } from "socket.io";
import { env } from "@util/env";

export type Context = {
  mysqlAdapter: IMysqlAdapter;
  socket?: Server;
  messageBusAdapter: IMessageBusAdapterConstructs;
};

export class ContactRepository implements IContactRepository {
  private mysqlAdapter: Context["mysqlAdapter"];
  private socket?: Context["socket"];
  private messageBusAdapter: IMessageBusAdapter;

  constructor({ mysqlAdapter, socket, messageBusAdapter }: Context) {
    this.mysqlAdapter = mysqlAdapter;
    this.mysqlAdapter.tableName = "contact";
    this.socket = socket;
    this.messageBusAdapter = new messageBusAdapter();
  }

  public async find(): Promise<Contact[]> {
    return this.mysqlAdapter.db;
  }

  async asyncCreate(contact: Contact): Promise<void> {
    await this.messageBusAdapter.publish(
      env.get().amqp.exchanges.example.key,
      env.get().amqp.exchanges.example.routing,
      contact
    );
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
