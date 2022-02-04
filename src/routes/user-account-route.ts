import { Router } from 'express'
import knex from '../infra/database/connection'

const userAccount = Router()

userAccount.get('/:id', async (req, res) => {
	const { id } = req.params

	const users = await knex('user_account')
		.where('user_account.id', id)
		.select('user_account.id', 'user_account.email', 'user_account.created_at', 'updated_at').first()

	if(users) {
		return res.status(200).json(users)
	} else {
		return res.status(404).json({
			statusCode: 404,
			message: 'Users not found'
		})
	}
})

userAccount.post('/', async (req, res) => {
	const { email, password }	= req.body

	const newUser = {
		email,
		password,
		created_at: new Date()
	}

	const id = await knex('user_account').insert(newUser).returning('id').then(prop => prop[0].id)

	const user = await knex('user_account')
		.where('user_account.id', id)
		.select('user_account.id', 'user_account.email', 'user_account.created_at', 'updated_at').first()

	return res.status(201).json(user)
})

export default userAccount
