import { Chance } from "chance";
import { Contact } from "@type/contact";
const chance = new Chance();

export const contactMock = {
  name: chance.name(),
  phone: chance.phone(),
} as Contact;

