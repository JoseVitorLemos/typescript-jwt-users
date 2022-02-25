import { body } from 'express-validator'

const userSchema = [
  body('email')
  .normalizeEmail()
  .isEmail()
  .withMessage('email must contain a valid email address'),

	body('password').isLength({ min: 8, max: 16 })
	.withMessage('password must container min 8 caracters and max 16')
]

export { userSchema }


