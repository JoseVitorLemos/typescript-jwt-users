import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export default class AuthController {
	async validateToken(req: Request, res: Response) {
		const token: string = req.headers.authorization?.split(' ')[1] as string

		if(!token) res.status(400).json({
			statusCode: 400,
			message: 'Invalid data'
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
}
