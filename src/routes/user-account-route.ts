import 'dotenv/config'
import { Request, Response } from 'express'
import { Router } from 'express'
import UserAccountController from '../controller/user-controller'
import { AuthGuard } from '../auth/auth-guard'
import { userSchema } from '../controller/validations/user-validations'
import { userSchemaDto } from '../controller/validations/user-schemas'

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
		this.router.get('/search', AuthGuard, async (req: Request, res: Response) => {
			await this.userAccount.search(req, res)
		})

		this.router.put('/update', AuthGuard, async (req: Request, res: Response) => {
			await this.userAccount.update(req, res)
		})

		this.router.post('/login', userSchema, userSchemaDto, async (req: Request, res: Response) => {
			await this.userAccount.login(req, res)
		})

		this.router.post('/signup', userSchema, userSchemaDto, async (req: Request, res: Response) => {
			await this.userAccount.signup(req, res)
		})	
	}
}

export default new UserAccount
