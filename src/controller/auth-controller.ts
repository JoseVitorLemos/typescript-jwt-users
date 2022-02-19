import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { signToken, verifyRefreshToken } from '../helper/jwt-helper'

export default class AuthController {
	async validateToken(req: Request, res: Response) {
		const token: string = req.headers.authorization?.split(' ')[1] as string

		if(!token) res.status(400).json({
			statusCode: 400,
			message: 'Invalid data token'
		}).end()

		jwt.verify(token, process.env.TOKEN as string, (err) => {
			if(err) return res.status(401).json({ statusCode: 401, auth: false, message: 'Unauthorized' })

		})

		res.status(200).json({
			statusCode: 200,
			auth: true,
			message: 'Unauthorized'
		})
	}

	async refreshToken(req: Request, res: Response) {
		const { refreshToken } = req.body

		try {
			if(!refreshToken) {
				return res.status(400).json({
					statusCode: 400,
					message: 'Refresh Token invalid'
				})
			}

			const userId = await verifyRefreshToken(refreshToken)

			if(!userId) res.status(400).json({ statusCode: 400, message: 'Invalid signature' })
			const acessToken = await signToken(Number(userId))

			if(userId) {
				return res.status(200).json(acessToken)
			}
		} catch (err) {
			return res.status(400).json({
				statusCode: 400,
				message: err 
			})
		}
	}
}
