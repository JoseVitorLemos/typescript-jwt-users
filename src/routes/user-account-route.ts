import 'dotenv/config'
import { Router } from 'express'
import UserAccountController from '../controller/user-controller'
import { AuthGuard } from '../auth/auth-guard'

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
		this.router.post('/search', AuthGuard, async (req, res) => {
			await this.userAccount.search(req, res)
		})

		this.router.put('/update', AuthGuard, async (req, res) => {
			await this.userAccount.update(req, res)
		})

		this.router.post('/login', async (req, res) => {
			await this.userAccount.login(req, res)
		})

		this.router.post('/signup', async (req, res) => {
			await this.userAccount.signup(req, res)
		})	
	}
}

export default new UserAccount
