import { MysqlAdapter } from "@adapter/mysql";
import { ContactRepository } from "../contact";
import { MysqlDatabase } from "@type/infrastructure";

describe("Example Repository", () => {

  describe("#constructor", () => {
    it("constructs with all properties", () => {
      const mysqlAdapter = new MysqlAdapter({
        dbConn: (jest.fn() as unknown) as MysqlDatabase,
      });

      const u = new ContactRepository({
        mysqlAdapter,
      });

      expect(u).toBeDefined();
      // @ts-ignore
      expect(mysqlAdapter._tbName).toEqual("contact");
      expect(u.find).toBeInstanceOf(Function);
    });
  });

  describe("#find", () => {
    it("find a wallet", async () => {
      const db = {
        options: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        then: jest.fn((done) => {
          done([
            {
              bankAccountId: 1,
            },
          ]);
        }),
      };
      const dbConn = (jest.fn(() => {
        return db;
      }) as unknown) as MysqlDatabase;
      const mysqlAdapter = new MysqlAdapter({ dbConn });
      const u = new ContactRepository({
        mysqlAdapter,
      });

      const [wallet] = await u.find();
      
      expect(wallet).toEqual({
        bankAccountId: 1,
      });
    });
  });
  
});
