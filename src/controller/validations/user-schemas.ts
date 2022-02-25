import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export const userSignupDto = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		const err = errors.array().map(err => err.msg)
	  return res.status(400).json({ statusCode: 400, message: err })
	}
	next()
}
