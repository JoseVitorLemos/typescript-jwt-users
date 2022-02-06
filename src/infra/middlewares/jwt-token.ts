import 'dotenv/config'
import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function verifyJWT(req: any, res: Response, next: NextFunction) {
	const token: string = req.headers['x-acess-token'] || req.query.token || req.body.token

	jwt.verify(token, process.env.TOKEN as string, (err, decoded: any) => {
		if(err) return res.status(401).json({ statusCode: 401, message: 'Autentication fail' }).end()

		req.userId = decoded.userId
		next()
	})
}

