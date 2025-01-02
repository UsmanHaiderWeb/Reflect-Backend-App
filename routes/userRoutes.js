import express from 'express';
import registerUser from '../controllers/userControllers/register.controller.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);

export default userRouter;