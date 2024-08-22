import { Router } from "express";
import checkLogin from "../../middleware/auth.middleware.js";
import allowUser from "../../middleware/rbac.middeleware.js";
import { UserTypes } from "../../config/constants.js";
import { uploader, setPath } from "../../middleware/uploader.middleware.js";
import bodyValidator from "../../middleware/validator.middleware.js";
import CatagoryCreateDto from "./catagory.request.js";
import catagoryController from "./catagory.controller.js";

const catagoryRoute = Router();

catagoryRoute.route('/')
    .post(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), setPath('/catagories'),
        uploader.single('image'), bodyValidator(CatagoryCreateDto), catagoryController.create)
    .get(checkLogin, allowUser(UserTypes.ADMIN), catagoryController.index)

catagoryRoute.route('/:id')
    .get(checkLogin, allowUser(UserTypes.ADMIN), catagoryController.show)
    .put(checkLogin, allowUser(UserTypes.ADMIN), setPath('/catagories'),
        uploader.single('image'), bodyValidator(CatagoryCreateDto), catagoryController.update)
    .delete(checkLogin, allowUser(UserTypes.ADMIN), catagoryController.delete)


export default catagoryRoute