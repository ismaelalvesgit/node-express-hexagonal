import { Chance } from "chance";
import { ContactRepository } from "@repository/contact";
import { cepMock } from "@repository/__tests__/__mocks__/brasilRepository.mock";
import { Contact } from "@type/contact";
import { MysqlAdapter } from "@adapter/mysql";
import { RedisAdapter } from "@adapter/redis";
import { SystemRepository } from "@repository/system";
import { env } from "@util/env";

const chance = new Chance();
const mysqlAdapter = new MysqlAdapter();

export const findContactMock = { id: chance.integer({min: 0, max: 10}) };
export const createContactMock = { name: chance.guid(), phone: chance.phone() } as Contact;

export const serviceMock = {
    systemRepository: new SystemRepository({config: env, redisAdapter: RedisAdapter}),
    contactRepository: new ContactRepository({mysqlAdapter}),
    brasilRepository: {
        getCep: jest.fn().mockResolvedValue({ ...cepMock }),
    },
}; 
