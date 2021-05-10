import express from 'express';
import { login } from '../auth-controller'

const AuthRouter = express.Router();

AuthRouter.get('/login', login)

export default AuthRouter