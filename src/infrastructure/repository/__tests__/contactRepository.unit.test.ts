import { MysqlAdapter } from "@adapter/mysql";
import { ContactRepository } from "../contact";
import { MysqlDatabase } from "@type/infrastructure";
import { Contact } from "@type/contact";
import { contactMock, messageBusAdapterMock } from "./__mocks__/contactRepository.mock";

describe("Contact Repository", () => {
  const mysqlAdapter = new MysqlAdapter();
  const contactRepository = new ContactRepository({
    mysqlAdapter,
    messageBusAdapter: messageBusAdapterMock
  });

  beforeAll(async()=>{
    await contactRepository.create(contactMock);
  });

  describe("#constructor", () => {
    it("constructs with all properties", () => {
      const mysqlAdapter = new MysqlAdapter({
        dbConn: (jest.fn() as unknown) as MysqlDatabase,
      });

      const u = new ContactRepository({
        mysqlAdapter,
        messageBusAdapter: messageBusAdapterMock
      });

      expect(u).toBeDefined();
      // @ts-ignore
      expect(mysqlAdapter._tbName).toEqual("contact");
      expect(u.find).toBeInstanceOf(Function);
    });
  });

  describe("asyncCreate", () => {
    it("should create published contact", async () => {
      await expect(contactRepository.asyncCreate({
        name: new Date().toISOString(),
        phone: "13456"
      } as Contact)).resolves.not.toThrow();
    });
  });

  describe("create", () => {
    it("should create new contact", async () => {
      await expect(contactRepository.create({
        name: new Date().toISOString(),
        phone: "13456"
      } as Contact)).resolves.not.toThrow();
    });
  });

  describe("update", () => {
    it("should update contact", async () => {
      const [contact] = await contactRepository.find();
      await expect(contactRepository.update({
        ...contactMock,
        id: contact.id
      })).resolves.not.toThrow();
    });
  });

  describe("delete", () => {
    it("should delete by id", async () => {
      const [contact] = await contactRepository.find();
      await expect(contactRepository.update({
        id: contact.id
      } as Contact)).resolves.not.toThrow();
    });
  });

  describe("find", () => {
    it("should find contacts", async () => {
      const [result] = await contactRepository.find();
      expect(result.name).toStrictEqual(contactMock.name);
    });
  });
  
});
