import { HttpAdapter } from "@adapter/http";
import { BadRequest } from "@util/error";
import { BrasilRepository } from "../brasil";
import httpStatus from "http-status-codes";
import nock from "nock";
import { cepMock, config, context } from "./__mocks__/brasilRepository.mock";
import { env } from "@util/env";

describe("Brasil Repository", () => {

  afterEach(nock.cleanAll);

  describe("#constructor", () => {
    it("constructs with all properties", () => {
      const u = new BrasilRepository({
        config: env.get(),
        httpAdapter: HttpAdapter,
      });

      expect(u).toBeDefined();
    });
  });

  describe("#getCep", () => {
    it("should get cep with success", async () => {

      const { cep } = cepMock;
      const repo = new BrasilRepository(context);

      nock(config.brasilApi)
      .get(`/api/cep/v2/${cep}`)
      .reply(httpStatus.OK, {
        ...cepMock ,
      });

      const data = await repo.getCep(cep);

      expect(data).toEqual(cepMock);
    });

    it("throw bad request error in request", async () => {
      const { cep } = cepMock;
      const repo = new BrasilRepository(context);
      nock(config.brasilApi)
      .get(`/api/cep/v2/${cep}`)
      .reply(httpStatus.BAD_REQUEST);

      await expect(repo.getCep(cep))
      .rejects
      .toThrow(new BadRequest("Failed to request cep"));
    });
  });
  
});
