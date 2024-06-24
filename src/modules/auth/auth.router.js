import { Router } from "express";
import userControl from '../user/user.controller.js';
import { uploder, setPath } from '../../middleware/uploader.middleware.js';
import bodyValidator from '../../middleware/validator.middleware.js';
import UserCreateDto from '../user/user.request.js';
import AuthControl from './auth.controller.js'
const userRoute = Router();



userRoute.post('/register', setPath('user'),
    uploder.single('image'), bodyValidator(UserCreateDto), userControl.userCreate);
userRoute.get('/activate/:token', AuthControl.activateUser)
userRoute.get('/resend-token/:token', AuthControl.resendActivationToken)



export default userRoute