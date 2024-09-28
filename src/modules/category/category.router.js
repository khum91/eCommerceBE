import { Router } from "express";
import checkLogin from "../../middleware/auth.middleware.js";
import allowUser from "../../middleware/rbac.middeleware.js";
import { UserTypes } from "../../config/constants.js";
import { uploader, setPath } from "../../middleware/uploader.middleware.js";
import bodyValidator from "../../middleware/validator.middleware.js";
import categoryCreateDto from "./category.request.js";
import categoryController from "./category.controller.js";

const categoryRoute = Router();

categoryRoute.route('/')
    .post(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), setPath('/categories'),
        uploader.single('image'), bodyValidator(categoryCreateDto), categoryController.create)
    .get(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), categoryController.index)

categoryRoute.route('/parent')
    .get(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), categoryController.options)

categoryRoute.route('/:id')
    .get(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), categoryController.checkauthor, categoryController.show)
    .put(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), categoryController.checkauthor, setPath('/categories'),
        uploader.single('image'), bodyValidator(categoryCreateDto), categoryController.update)
    .delete(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), categoryController.checkauthor, categoryController.delete)


export default categoryRoute