import 'dotenv/config'
import { Router } from 'express'
import UserAccountController from '../controller/user-controller'
import { verifyJWT } from '../infra/middlewares/jwt-token'

class UserAccount {
	private router: Router
	private userAccount: UserAccountController

	constructor() {
		this.router = Router()
		this.routes()
		this.userAccount = new UserAccountController()
	}

	getRoute() {
		return this.router
	}

	private routes() {
		this.router.get('/:id', verifyJWT, async (req, res) => {
			await this.userAccount.findById(req, res)
		})

		this.router.post('/login', async (req, res) => {
			await this.userAccount.login(req, res)
		})
	}
}

export default new UserAccount
