import { UseCaseContext } from "@type/core";
import { ContactUseCase } from "../contact";
import { userCaseMock, createContactMock } from "@test/container.mock";
import { Contact } from "@type/contact";

describe("Contact Use Case", () => {

  beforeAll(async()=>{
    await userCaseMock.contactService.create(createContactMock);
  });

  describe("#constructor", () => {
    it("doesn't constructs with undefined UseCaseContext", () => {
      let err;
      try {
        const uc = new ContactUseCase(undefined as unknown as UseCaseContext);
        expect(uc).toBeUndefined();
      } catch (error:any) {
        err = error;
      } finally{
        expect(err).toBeInstanceOf(Error);
        expect(err).toHaveProperty("name", "TypeError");
        expect(err.message).toContain("contactService' of undefined");
      }
    });

    it("constructs with an empty UseCaseContext object", () => {
      const uc = new ContactUseCase({} as UseCaseContext);
      expect(uc).toBeInstanceOf(ContactUseCase);
      expect(uc).toHaveProperty("find");
    });
  });

  describe("#find", () => {
    it("Must be successful", async () => {
      const uc = new ContactUseCase(userCaseMock);
      const [ contact ] = await uc.find();

      expect(contact.name).toEqual(createContactMock.name);
    });
  });

  describe("#asyncCreate", ()=>{
    it("Must be successful", async () => {
      const uc = new ContactUseCase(userCaseMock);
      await expect(uc.asyncCreate({
        name: new Date().toISOString(),
        phone:  new Date().getTime().toString()
      } as Contact)).resolves.not.toThrow();
    });
  });
  
  describe("#create", ()=>{
    it("Must be successful", async () => {
      const uc = new ContactUseCase(userCaseMock);
      await expect(uc.create({
        name: new Date().toISOString(),
        phone:  new Date().getTime().toString()
      } as Contact)).resolves.not.toThrow();
    });
  });

  describe("#update", ()=>{
    it("Must be successful", async () => {
      const uc = new ContactUseCase(userCaseMock);
      const [contact] = await uc.find();
      await expect(uc.update({
        name: new Date().toISOString(),
        phone: "13456",
        id: contact.id
      } as Contact)).resolves.not.toThrow();
    });
  });

  describe("#delete", ()=>{
    it("Must be successful", async () => {
      const uc = new ContactUseCase(userCaseMock);
      const [contact] = await uc.find();
      await expect(uc.delete(contact.id)).resolves.not.toThrow();
    });
  });
});
