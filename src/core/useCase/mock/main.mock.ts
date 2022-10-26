import { serviceMock } from "@core/service/mock/main.mock";
import { cepMock } from "@repository/__tests__/__mocks__/brasilRepository.mock";
import { ContactService } from "@core/service/contact";
import { SystemService } from "@core/service/system";


export const userCaseMock = {
    systemService: new SystemService(serviceMock),
    contactService: new ContactService(serviceMock),
    brasilService: {
        getCep: jest.fn().mockResolvedValue({ ...cepMock }),
    },
}; 
