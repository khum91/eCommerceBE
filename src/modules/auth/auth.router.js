import { Router } from "express";
import userControl from '../user/user.controller.js';
import { uploder, setPath } from '../../middleware/uploader.middleware.js';
import bodyValidator from '../../middleware/validator.middleware.js';
import UserCreateDto from '../user/user.request.js';
const userRoute = Router();



const route= userRoute.post('/register', setPath('user'),
    uploder.single('image'), bodyValidator(UserCreateDto), userControl.userCreate);

export default route;