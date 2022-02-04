import express from 'express'
import routes from '../../routes'
import bodyParse from '../middlewares/body-parse-json'

const app = express()

app.use(bodyParse)

app.use(routes)

export default app
