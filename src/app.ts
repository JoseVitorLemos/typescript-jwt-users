import express, { Application } from 'express'
import UserAccountRoute from './routes/user-account-route'
import cors from 'cors'
import 'dotenv/config'

class App {
	private app: Application

	constructor() {
		this.app = express()
		this.enableCors()
		this.bodyParse()
		this.setupRoutes()
	}

	start(port: string | number = 3000) {
		return this.app.listen(port, () => console.log(`Server running at ${port}`))
	}

	bodyParse() {
	 	return this.app.use(express.json())
	}

	enableCors() {
		const LocalHost = process.env.LOCAL_HOST!.split(',')
		const allowedOrigins = LocalHost

		const options: cors.CorsOptions = {
			origin: allowedOrigins
		}

	 	return this.app.use(cors(options))
	}

	setupRoutes() {
		this.app.get('/', async (_req, res) => {
			return res.status(200).send('Welcome to my app')
		})

		this.app.use('/account', UserAccountRoute.getRoute())	
	}
}

export default new App
