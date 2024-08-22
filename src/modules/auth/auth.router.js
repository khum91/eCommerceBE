import { Router } from "express";
import userControl from '../user/user.controller.js';
import { uploader, setPath } from '../../middleware/uploader.middleware.js';
import bodyValidator from '../../middleware/validator.middleware.js';
import UserCreateDto from '../user/user.request.js';
import authControl from './auth.controller.js'
import loginDTO from "./auth.request.js";
import checkLogin from "../../middleware/auth.middleware.js";
import allowUser from "../../middleware/rbac.middeleware.js";


const userRoute = Router();



userRoute.post('/register', setPath('user'),
    uploader.single('image'), bodyValidator(UserCreateDto), userControl.userCreate);
userRoute.get('/activate/:token', authControl.activateUser)
userRoute.get('/resend-token/:token', authControl.resendActivationToken)

//Login
userRoute.post('/login/',bodyValidator(loginDTO), authControl.login)
userRoute.get('/me', checkLogin, authControl.getLoggedInUser)
userRoute.delete('/logout/', checkLogin, authControl.logout)

//For RBAC
// userRoute.get('/me/', checkLogin, allowUser('seller'), authControl.getLoggedInUser)

export default userRoute