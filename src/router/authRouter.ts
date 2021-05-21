import express from 'express';
import { login } from '../auth-controller'

const AuthRouter = express.Router();

AuthRouter.post('/login', login)

export default AuthRouter