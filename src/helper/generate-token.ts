import jwt from 'jsonwebtoken'

const generateToken = (id: number) => {
	const privateKey = process.env.TOKEN!

	const token = jwt.sign({ userId: id }, privateKey, { expiresIn: 600 })

	return { auth: true, token }
}

export default generateToken
