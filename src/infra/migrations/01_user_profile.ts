import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('user_profile', table => {
		table.increments('id').primary()
		table.string('name').notNullable()
		table.string('last_name').notNullable()
		table.string('email').notNullable()
		table.string('cpf').notNullable()
		table.date('birth_date').notNullable()
		table.dateTime('created_at').notNullable()
		table.dateTime('updated_at').nullable()

		table.integer('user_account_id').notNullable()
			.references('id')
			.inTable('user_account')
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('user_profile')
}
