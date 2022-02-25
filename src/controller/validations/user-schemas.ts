import { body } from 'express-validator'

const signupSchema = [
  body('email')
  	.normalizeEmail()
  	.isEmail()
  	.withMessage('email must contain a valid email address'),

	body('password').isLength({ min: 8, max: 16 })
		.withMessage('password must container min 8 caracters and max 16')
]

const loginSchema = [
  body('email')
  	.normalizeEmail()
  	.isEmail()
  	.withMessage('email must contain a valid email address'),

	body('password').isLength({ min: 8, max: 16 })
		.withMessage('password must container min 8 caracters and max 16')
]

const updateSchema = [
  body('email')
  	.normalizeEmail()
  	.isEmail()
  	.withMessage('email must contain a valid email address'),

	body('oldPassword').isLength({ max: 16 })
		.withMessage('old password must container max 16'),

	body('newPassword').isLength({ min: 8, max: 16 })
		.withMessage('new password must container min 8 caracters and max 16')
]

export { signupSchema, loginSchema, updateSchema }


