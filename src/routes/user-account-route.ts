import { Router } from 'express'
import knex from '../infra/database/connection'

const userAccount = Router()

userAccount.get('/:id', async (req, res) => {
	const { id } = req.params

	const user = await knex('user_account')
		.where('user_account.id', id)
		.select('user_account.id', 'user_account.email', 'user_account.created_at', 'user_account.updated_at').first()

	if(user) {
		return res.status(200).json(user)
	} else {
		return res.status(404).json({
			statusCode: 404,
			message: 'Users not found'
		})
	}
})

userAccount.post('/signup', async (req, res) => {
	const { email, password }	= req.body

	const newUser = {
		email,
		password,
		created_at: new Date()
	}

	const findEmail = await knex('user_account').where('user_account.email', email).first()

	if(findEmail) return res.status(400).json({ statusCode: 400, message: 'Email already registered' })

	const id = await knex('user_account').insert(newUser).returning('id').then(prop => prop[0].id)

	const user = await knex('user_account')
		.where('user_account.id', id)
		.select('user_account.id', 'user_account.email', 'user_account.created_at', 'user_account.updated_at').first()

	return res.status(201).json(user)
})


userAccount.post('/login', async (req, res) => {
	const { email, password } = req.body

	const user = await knex('user_account')
		.where('user_account.email', email)
		.select('user_account.email', 'user_account.password').first()

	if(!user) return res.status(400).json({ statusCode: 400, message: 'Email dont registered' })

	if(user.email == email && user.password == password) {
		return res.status(200).json('Login success !')
	} else {
		return res.status(400).json({ 
			statusCode: 400, 
			message: 'Autentication fail' })
	}
})

export default userAccount
