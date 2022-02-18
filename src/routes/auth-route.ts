import 'dotenv/config'
import { Router } from 'express'
import AuthController from '../controller/auth-controller'

class AuthRoute {
	private router: Router
	private auth: AuthController

	constructor() {
		this.router = Router()
		this.routes()
		this.auth = new AuthController()
	}

	getRoute() {
		return this.router
	}

	private routes() {
		this.router.post('/token', async (req, res) => {
			await this.auth.validateToken(req, res)
		})
	}
}

export default new AuthRoute
