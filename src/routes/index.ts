import { Router } from 'express'
import userAccount from './user-account-route'

const routes = Router()

routes.use('/account', userAccount)

export default routes


