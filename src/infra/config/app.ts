import express from 'express'
import bodyParse from '../middlewares/body-parse-json'

const app = express()

app.use(bodyParse)

export default app
