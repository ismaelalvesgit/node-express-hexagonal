import knex from "@util/knex"
jest.mock('ioredis', () => require('ioredis-mock'))

beforeAll(async()=>{
    await knex.migrate.latest()
})

afterAll(async()=>{
    await knex.destroy()
})