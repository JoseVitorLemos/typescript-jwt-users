import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('user_account', table => {
		table.increments('id').primary()
		table.string('email').notNullable()
		table.string('password').notNullable()
		table.dateTime('created_at').notNullable()
		table.dateTime('updated_at').nullable()
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('user_account')
}
