import express, { Application } from 'express'

class App {
	private app: Application

	constructor() {
		this.app = express()	
		this.bodyParse()
	}

	start(port: string | number = 3000) {
		return this.app.listen(port, () => console.log(`Server running at ${port}`))
	}

	bodyParse() {
	 return this.app.use(express.json())
	}
}

export default new App
