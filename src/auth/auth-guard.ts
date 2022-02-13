import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface userRequest extends Request {
	userId?: number
}

export function verifyJWT(req: userRequest, res: Response, next: NextFunction) {
	const token: string = req.headers['x-access-token'] || req.query.token || req.body.token

	jwt.verify(token, process.env.TOKEN as string, (err, decoded: any) => {
		if(err) return res.status(401).json({ statusCode: 401, auth: false, message: 'Unauthorized' })

		req.userId = decoded.userId
		next()
	})
}
