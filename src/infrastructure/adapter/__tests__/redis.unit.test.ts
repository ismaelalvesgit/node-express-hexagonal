/* eslint-disable jest/no-conditional-expect */
import { Chance } from "chance";
import { RedisAdapter } from "../redis";

const chance = new Chance();
const adapter = new RedisAdapter({});

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

  it("should return null in get method", async ()=>{
    const data = await adapter.get("any");
    expect(data).toBe(null);
  });

  it("should execute by sucess expire method", async ()=>{
    const key = "any";
    adapter.set(key, "data");
    expect(adapter.expire(key, 10)).toBeUndefined();
  });

  it("should execute by sucess expire delete", async ()=>{
    const key = "any";
    adapter.set(key, "data");
    expect(adapter.delete(key)).toBeDefined();
  });

  it("should execute by sucess expire deleteByPrefix", async ()=>{
    const key = "any";
    adapter.set(key, "data");
    expect(adapter.deleteByPrefix(key)).toBeDefined();
  });
});