import { Router } from 'express';
import UserCreateDto from './user.request.js';
import userController from './user.controller.js';
import checkLogin from '../../middleware/auth.middleware.js';
import allowUser from '../../middleware/rbac.middeleware.js';
import { uploader, setPath } from '../../middleware/uploader.middleware.js';
import bodyValidator from '../../middleware/validator.middleware.js';
import { UserTypes } from "../../config/constants.js";

const userRoute = Router();

// for '' pattern
userRoute.route('/')
    //Create User
    .post(checkLogin, allowUser(UserTypes.ADMIN), setPath('/users'),
        uploader.single('image'), bodyValidator(UserCreateDto), userController.userCreate)

    //User List
    .get(checkLogin, allowUser(UserTypes.ADMIN), userController.index)

//for  '/:id' pattern
userRoute.route('/:id')
    // User Details
    .get(checkLogin, allowUser(UserTypes.ADMIN), userController.userDetails)

    //User Update
    .put(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER, UserTypes.CUSTOMER]), setPath('/users'),
        uploader.single('image'), userController.userUpdate)

    //User Delete
    .delete(userController.userDelete);

export default userRoute;