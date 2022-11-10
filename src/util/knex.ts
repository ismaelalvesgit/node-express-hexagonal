import { knex, Knex } from "knex";
import { env } from "./env";
import knexfile from "../../knexfile";

let knexConn: Knex.Config;
switch (env.get().enviorement) {
  case "development":
    knexConn = knexfile.local;
    break;
  case "test":
    knexConn = knexfile.test;
    break;
  default:
    knexConn = knexfile.local;
    break;
}

export default knex(knexConn);