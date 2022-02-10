import express, { Application } from 'express'

class App {
	private app: Application

	constructor() {
		this.app = express()	
	}

	start(port: string | number = 3000) {
		return this.app.listen(port, () => console.log(`Server running at ${port}`))
	}
}

export default new App
