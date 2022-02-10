import 'dotenv/config'
import knex from '../infra/database/connection'
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
}
