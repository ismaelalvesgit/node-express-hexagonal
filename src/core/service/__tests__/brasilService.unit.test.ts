/* eslint-disable jest/no-conditional-expect */
import { ServiceContext } from "@type/core";
import { cepMock } from "@repository/__tests__/__mocks__/brasilRepository.mock";
import { BrasilService } from "../brasil";
import { serviceMock } from "@test/container.mock";


describe("Contact Service", () => {
  describe("#constructor", () => {
    it("doesn't construct without a ServiceContext object", () => {
      try {
        const svc = new BrasilService(undefined as unknown as ServiceContext);
        expect(svc).toBeUndefined();
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe("TypeError");
        expect(error.message).toContain("'brasilRepository' of undefined");
      }
    });

    it("constructs with an empty object", () => {
      const svc = new BrasilService({} as ServiceContext);
      expect(svc).toBeDefined();
      expect(svc).toBeInstanceOf(BrasilService);
      expect(svc).toHaveProperty("brasilRepository", undefined);
    });
  });

  describe("#find", () => {
    it("should call find repository with param", async () => {
      const { cep } = cepMock;
      const svc = new BrasilService(serviceMock);
      const result = await svc.getCep(cep);
      expect(serviceMock.brasilRepository.getCep).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ...cepMock });
    });
  });
});
/* eslint-enable jest/no-conditional-expect */