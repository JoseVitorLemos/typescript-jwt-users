import express, { Application } from 'express'
import UserAccountRoute from './routes/user-account-route'

class App {
	private app: Application

	constructor() {
		this.app = express()
		this.bodyParse()
		this.setupRoutes()
	}

	start(port: string | number = 3000) {
		return this.app.listen(port, () => console.log(`Server running at ${port}`))
	}

	bodyParse() {
	 	return this.app.use(express.json())
	}

	setupRoutes() {
		this.app.use('/account', UserAccountRoute.getUserRoute())	
	}
}

export default new App
