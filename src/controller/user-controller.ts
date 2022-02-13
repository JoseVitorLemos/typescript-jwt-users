import 'dotenv/config'
import knex from '../infra/database/connection'
import bcrypt from '../helper/bcrypt'
import { Request, Response } from 'express'
import { signToken } from '../helper/jwt-helper'

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
			const token = signToken(user.id)

			return res.status(200).json(token)
		}

		return res.status(401).json({ 
			statusCode: 401, 
			message: 'Invalid password' 
		}).end()
	}

	async signup(req: Request, res: Response) {
		const { email, password }	= req.body

		const hashedPassword = await bcrypt.hash(password)

		const newUser = {
		 	email,
			password: hashedPassword,
			created_at: new Date()
		}

		const findEmail = await knex('user_account').where('user_account.email', email).first()

		if(findEmail) return res.status(400).json({ statusCode: 400, message: 'Email already registered' })

		const id = await knex('user_account').insert(newUser).returning('id').then(prop => prop[0].id)

		const user = await knex('user_account')
		.where('user_account.id', id)
		.select('user_account.id', 'user_account.email', 'user_account.created_at', 'user_account.updated_at').first()

		return res.status(201).json(user)
	}

	async update(req: Request, res: Response) {
		const { newPassword, oldPassword } = req.body

		const id = req.params.id

		const { passwordHash } = await knex('user_account')
		.where('user_account.id', id)
		.select('user_account.password').first()

		const equalPassword = await bcrypt.compare(newPassword, passwordHash)

		if(equalPassword) return res.status(400).json({
			statusCode: 400,
			message: `Password it's equal`
		})

		const checkPassword = await bcrypt.compare(oldPassword, passwordHash)

		const hashedPassword = await bcrypt.hash(newPassword)

		if(checkPassword) {
			try {
				await knex('user_account').where('user_account.id', req.params.id).update({ password: hashedPassword })

				return res.status(200).json({
					statusCode: 200,
					message: 'Updated success password'
				})
			} catch (err) {
				return res.send(err).end()
			}
		}

		return res.status(400).json({
			statusCode: 400,
			message: 'Invalid password'
		})
	}
}
