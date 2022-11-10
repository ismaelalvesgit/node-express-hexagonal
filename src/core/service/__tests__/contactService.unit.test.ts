import { ServiceContext } from "@type/core";
import { ContactService } from "../contact";
import { serviceMock, createContactMock } from "../mock/main.mock";
import { Contact } from "@type/contact";

describe("Contact Service", () => {

  beforeAll(async()=>{
    await serviceMock.contactRepository.create(createContactMock);
  });

  describe("#constructor", () => {
    it("doesn't construct without a ServiceContext object", () => {
      let err;
      try {
        const svc = new ContactService(undefined as unknown as ServiceContext);
        expect(svc).toBeUndefined();
      } catch (error: any) {
        err = error;
      } finally {
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.name).toBe("TypeError");
        expect(err.message).toContain("'contactRepository' of undefined");
      }
    });

    it("constructs with an empty object", () => {
      const svc = new ContactService({} as ServiceContext);
      expect(svc).toBeDefined();
      expect(svc).toBeInstanceOf(ContactService);
      expect(svc).toHaveProperty("contactRepository", undefined);
    });
  });

  describe("#find", () => {
    it("should call find repository with filters", async () => {
      const svc = new ContactService(serviceMock);
      const [ result ] = await svc.find();
      expect(result.name).toEqual(createContactMock.name);
    });
  });
  
  describe("#asyncCreate", () => {
    it("should call create repository with correct values", async () => {
      const svc = new ContactService(serviceMock);
      await expect(svc.asyncCreate({
        name: new Date().toISOString(),
        phone:  new Date().getTime().toString()
      } as Contact)).resolves.not.toThrow();
    });
  });
  
  describe("#create", () => {
    it("should call create repository with correct values", async () => {
      const svc = new ContactService(serviceMock);
      await expect(svc.create({
        name: new Date().toISOString(),
        phone:  new Date().getTime().toString()
      } as Contact)).resolves.not.toThrow();
    });
  });

  describe("#update", () => {
    it("should call update repository with correct values", async () => {
      const svc = new ContactService(serviceMock);
      const [contact] = await svc.find();
      await expect(svc.update({
        name: new Date().toISOString(),
        phone: "13456",
        id: contact.id
      } as Contact)).resolves.not.toThrow();
    });
  });

  describe("#delete", () => {
    it("should call delete repository with correct values", async () => {
      const svc = new ContactService(serviceMock);
      const [contact] = await svc.find();
      await expect(svc.delete({
        id: contact.id
      } as Contact)).resolves.not.toThrow();
    });
  });
});