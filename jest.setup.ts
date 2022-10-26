import knex from "@util/knex"

beforeAll(async()=>{
    await knex.migrate.latest()
})

afterAll(async()=>{
    await knex.destroy()
})