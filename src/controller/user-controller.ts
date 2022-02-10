import 'dotenv/config'
import knex from '../infra/database/connection'
import bcrypt from 'bcrypt'
import generateToken from '../helper/generate-token'
import { Request, Response } from 'express'

export default class UserAccountController {
	async findById(req: Request, res: Response) {
		const { id } = req.params

		const user = await knex('user_account')
		.where('user_account.id', id)
		.select('user_account.id', 'user_account.email', 'user_account.created_at', 'user_account.updated_at').first()

		if(user) {
			return res.status(200).json(user)
		}
		return res.status(404).json({
			statusCode: 404,
			message: 'Users not found'
		})
	}	

	async login(req: Request, res: Response) {
		const { email, password } = req.body

		const user = await knex('user_account')
		.where('user_account.email', email)
		.select('user_account.id', 'user_account.email', 'user_account.password').first()

		if(!user) return res.status(400).json({ statusCode: 400, message: 'Email dont registered' })

		const checkPassword = await bcrypt.compare(password, user.password)

		if(checkPassword) { 
			const token = generateToken(user.id)

			return res.status(200).json(token)
		}

		return res.status(401).json({ 
			statusCode: 401, 
			message: 'Invalid password' 
		}).end()
	}
}
