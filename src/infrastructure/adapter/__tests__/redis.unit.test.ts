/* eslint-disable jest/no-conditional-expect */
import { Chance } from "chance";
import { RedisAdapter } from "../redis";
import redis from "redis";
const chance = new Chance();
describe("redis adapter", () => {
  beforeAll(()=> jest.mock("redis", () => redis));
  it("constructs with all properties", () => {
    try {
      new RedisAdapter({
        url: `${chance.url()}:${chance.integer({ min: 0, max: 65536 })}`
      });
    } catch (error:any) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("TypeError");
      expect(error.message).toContain("Invalid protocol");
    }
  });
});
/* eslint-enable jest/no-conditional-expect */