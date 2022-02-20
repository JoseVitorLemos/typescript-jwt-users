import 'dotenv/config'
import knex from '../infra/database/connection'
import bcrypt from '../helper/bcrypt'
import { Request, Response } from 'express'
import { signToken, signRefreshToken } from '../helper/jwt-helper'

export default class UserAccountController {
	async search(req: Request, res: Response) {
		const { email } = req.body

		const user = await knex('user_account')
			.where('user_account.email', email)
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
			const accessToken = await signToken(user.id)
			const refreshToken = await signRefreshToken(user.id.toString())

			return res.status(200).json({ ...accessToken, refreshToken })
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

		const accessToken = await signToken(id)
		const refreshToken = await signRefreshToken(id.toString())

		return res.status(200).json({ ...accessToken, refreshToken })
	}

	async update(req: Request, res: Response) {
		const { newPassword, oldPassword } = req.body

		const { userId } = req as any

		const id = req.params.id

		if(userId != id) res.status(400).json({
			statusCode: 400,
			message: 'Invalid id to update'
		}).end()

		try {
			const { password } = await knex('user_account')
				.where('user_account.id', id)
				.select('user_account.password').first()

			if(!password) return res.status(400).json({
				statusCode: 400,
				message: `User id not exist`
			})

			const equalPassword = await bcrypt.compare(newPassword, password)

			if(equalPassword) return res.status(400).json({
				statusCode: 400,
				message: `Password it's equal`
			})

			const checkPassword = await bcrypt.compare(oldPassword, password)

			const hashedPassword = await bcrypt.hash(newPassword)

			if(checkPassword) {
				await knex('user_account').where('user_account.id', req.params.id).update({ password: hashedPassword })

				return res.status(200).json({
					statusCode: 200,
					message: 'Updated success password'
				})
			}
		} catch (err) {
			return res.send(err).end()
		}

		return res.status(400).json({
			statusCode: 400,
			message: 'Invalid password'
		})
	}	
}
