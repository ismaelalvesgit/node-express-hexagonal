import { cepMock } from "@repository/__tests__/__mocks__/brasilRepository.mock";
import { UseCaseContext } from "@type/core";
import { BrasilUseCase } from "../brasil";
import { userCaseMock } from "@test/container.mock";

describe("Brasil Use Case", () => {
  describe("#constructor", () => {
    it("doesn't constructs with undefined UseCaseContext", () => {
      let err;
      try {
        const uc = new BrasilUseCase(undefined as unknown as UseCaseContext);
        expect(uc).toBeUndefined();
      } catch (error:any) {
        err = error;
      } finally{
        expect(err).toBeInstanceOf(Error);
        expect(err).toHaveProperty("name", "TypeError");
        expect(err.message).toContain("brasilService' of undefined");
      }
    });

    it("constructs with an empty UseCaseContext object", () => {
      const uc = new BrasilUseCase({} as UseCaseContext);
      expect(uc).toBeInstanceOf(BrasilUseCase);
      expect(uc).toHaveProperty("getCep");
    });
  });

  describe("#get", () => {
    it("Must be successful", async () => {
      const { cep } = cepMock;
      const uc = new BrasilUseCase(userCaseMock);
      const result = await uc.getCep(cep);

      expect(result).toEqual(cepMock);
    });
  });
});