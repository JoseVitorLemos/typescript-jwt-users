import { Router } from 'express'
import knex from '../infra/database/connection'
import 'dotenv/config'
import { verifyJWT } from '../infra/middlewares/jwt-token'
import bcrypt from 'bcrypt'
import generateToken from '../helper/generate-token'

class UserAccount {
	private router: Router

	constructor() {
		this.router = Router()
		this.userRoutes()
	}

	getUserRoute() {
		return this.router
	}

	private userRoutes () {
		this.router.get('/:id', verifyJWT, async (req, res) => {
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
		})

		this.router.post('/signup', async (req, res) => {
			const { email, password }	= req.body

			const hashedPassword = await bcrypt.hash(password, 10)

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
		})

		this.router.post('/login', async (req, res) => {
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
		})

		this.router.put('/user-account/:id', verifyJWT, async (req, res) => {
			const { oldPassword, newPassword } = req.body

			const { password } = await knex('user_account')
			.where('user_account.id', req.params.id)
			.select('user_account.password').first()

			const equalPassword = await bcrypt.compare(newPassword, password)

			if(equalPassword) return res.status(400).json({
				statusCode: 400,
				message: `Password it's equal`
			})

			const checkPassword = await bcrypt.compare(oldPassword, password)

			const hashedPassword = await bcrypt.hash(newPassword, 10)

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

			return res.status(204).json({
				statusCode: 204,
				message: 'Invalid password'
			})
		})
	}
}

export default new UserAccount
