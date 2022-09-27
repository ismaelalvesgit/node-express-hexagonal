import { Knex } from "knex";

const createdAt = (knex: Knex, table: Knex.TableBuilder) => table.timestamp('createdAt', { precision: 3 })
  .notNullable()
  .defaultTo(knex.fn.now(3));

const updatedAt = (knex: Knex, table: Knex.TableBuilder) => table.timestamp('updatedAt', { precision: 3 })
  .notNullable()
  .defaultTo(knex.raw('CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)'));

export async function up(knex: Knex) {
  await knex.schema.createTable('contact', (table)=>{
    table.bigIncrements('id').unsigned();
    table.string('name').notNullable();
    table.string('phone', 20).unique().notNullable();
    createdAt(knex, table);
    updatedAt(knex, table);
  });
};


export async function down(knex: Knex) {
  await knex.schema.dropTable('contact');
};
