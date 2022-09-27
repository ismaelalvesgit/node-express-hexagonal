import { Knex } from "knex";
import Chance from "chance"

const chance = new Chance()

const data = [
  {
    name: chance.name(),
    phone: chance.phone()
  },
  {
    name: chance.name(),
    phone: chance.phone()
  },
  {
    name: chance.name(),
    phone: chance.phone()
  }
]
export async function seed(knex: Knex) {
  return knex.transaction(async (trx) => {
    await Promise.all(data.map(async(item)=>{
      await knex("contact").insert(item).transacting(trx);
    }))
  });
};
