import jwt from 'jsonwebtoken'

export async function signToken (id: number) {
	const privateKey = process.env.TOKEN!
	const token = jwt.sign({ userId: id }, privateKey, { expiresIn: 600 })
	return { auth: true, token }
}
