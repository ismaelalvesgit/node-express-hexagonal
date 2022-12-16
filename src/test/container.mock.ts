import { cepMock } from "@repository/__tests__/__mocks__/brasilRepository.mock";
import { ContactService } from "@core/service/contact";
import { SystemService } from "@core/service/system";
import { Chance } from "chance";
import { ContactRepository } from "@repository/contact";
import { Contact } from "@type/contact";
import { MysqlAdapter } from "@adapter/mysql";
import { RedisAdapter } from "@adapter/redis";
import { SystemRepository } from "@repository/system";
import { env } from "@util/env";
import { messageBusAdapterMock } from "@repository/__tests__/__mocks__/contactRepository.mock";

const chance = new Chance();
const mysqlAdapter = new MysqlAdapter();

export const findContactMock = { id: chance.integer({min: 0, max: 10}) };
export const createContactMock = { name: chance.guid(), phone: chance.phone() } as Contact;

export const serviceMock = {
    systemRepository: new SystemRepository({config: env.get(), redisAdapter: RedisAdapter}),
    contactRepository: new ContactRepository({mysqlAdapter,  messageBusAdapter: messageBusAdapterMock }),
    brasilRepository: {
        getCep: jest.fn().mockResolvedValue({ ...cepMock }),
    },
}; 

export const userCaseMock = {
    systemService: new SystemService(serviceMock),
    contactService: new ContactService(serviceMock),
    brasilService: {
        getCep: jest.fn().mockResolvedValue({ ...cepMock }),
    },
}; 
