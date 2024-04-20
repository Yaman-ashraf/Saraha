import express from 'express';
import * as authController from './Controller/Auth.controller.js';
import { asyncHandler } from '../../Middleware/errorHandling.js'
import validation from '../../Middleware/validation.js';
import { signinSchema, signupSchema } from './Auth.validation.js';
const app = express();

app.post('/signup', validation(signupSchema), asyncHandler(authController.signup));
app.post('/signin', validation(signinSchema), asyncHandler(authController.signin));
app.get('/confirmEmail/:token', asyncHandler(authController.confirmEmail));
app.get('/NewconfirmEmail/:Refreshtoken', asyncHandler(authController.newconfirmEmail));

export default app;