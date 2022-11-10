import { Chance } from "chance";
import { HttpAdapter } from "@adapter/http";
import { env } from "@util/env";

const chance = new Chance();

export const cepMock = {
    cep: chance.d8(),
    state: chance.state(),
    city: chance.city(),
    neighborhood: chance.locale(),
    street: chance.street(),
    service: chance.name_prefix(),
    location: {
      type: chance.name_prefix(),
      coordinates: {
        longitude: chance.longitude(),
        latitude: chance.latitude()
      }
    }
};


export const config = {
  ...env.get(),
  brasilApi: chance.url(),
};

export const context = {
  config,
  httpAdapter: HttpAdapter,
};


