import { Router } from 'express';
import userControl from './user.controller.js';
import checkLogin from '../../middleware/auth.middleware.js';
import allowUser from '../../middleware/rbac.middeleware.js';
import {uploader, setPath} from '../../middleware/uploader.middleware.js';
import bodyValidator from '../../middleware/validator.middleware.js';
import UserCreateDto from './user.request.js';

const userRoute = Router();

userRoute.use(checkLogin, allowUser);



// for '' pattern
userRoute.route('/')

    //User List
    .get(userControl.userList )

    //Create User
    .post(setPath('/user'), uploader.single('image'),bodyValidator(UserCreateDto), userControl.userCreate);

//for  '/:id' pattern
userRoute.route('/:id')

    // User Details
    .get(userControl.userDetails)

    //User Update
    .put(userControl.userUpdate)

    //User Delete
    .delete(userControl.userDelete);

export default userRoute;