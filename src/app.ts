import express, { Application } from 'express'
import UserAccountRoute from './routes/user-account-route'
import AuthRoute from './routes/auth-route'
import cors from 'cors'
import 'dotenv/config'

class App {
	private app: Application

	constructor() {
		this.app = express()
		this.globalMiddleware()
		this.setupRoutes()
	}

	start(port: string | number) {
		return this.app.listen(port, () => console.log(`Server running at ${port}`))
	}

	bodyParse() {
	 	return this.app.use(express.json())
	}

	enableCors() {
		const allowedOrigins = process.env.LOCAL_HOST!.split(',')
		const options: cors.CorsOptions = {
			origin: allowedOrigins
		}

	 	return this.app.use(cors(options))
	}

	globalMiddleware() {
		this.enableCors()
		this.bodyParse()
	}

	setupRoutes() {
		this.app.get('/', async (_req, res) => {
			return res.status(200).send('Welcome to my app')
		})

		this.app.use('/account', UserAccountRoute.getRoute())	
		this.app.use('/auth', AuthRoute.getRoute())	
	}
}

export default new App
