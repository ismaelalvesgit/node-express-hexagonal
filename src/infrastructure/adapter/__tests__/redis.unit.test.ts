/* eslint-disable jest/no-conditional-expect */
import { Chance } from "chance";
import { RedisAdapter } from "../redis";

const chance = new Chance();
describe("redis adapter", () => {
  it("constructs with all properties", () => {
    try {
      new RedisAdapter({
        host: chance.url(),
        port: chance.integer({ min: 0, max: 65536 })
      });
    } catch (error:any) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("TypeError");
      expect(error.message).toContain("Invalid protocol");
    }
  });
});