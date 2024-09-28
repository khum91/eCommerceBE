import { Router } from "express";
import checkLogin from "../../middleware/auth.middleware.js";
import allowUser from "../../middleware/rbac.middeleware.js";
import { UserTypes } from "../../config/constants.js";
import { uploader, setPath } from "../../middleware/uploader.middleware.js";
import bodyValidator from "../../middleware/validator.middleware.js";
import BrandCreateDto from "./brand.request.js";
import brandController from "./brand.controller.js";

const brandRoute = Router();
brandRoute.get('/:slug/detail', brandController.getBySlug)
brandRoute.route('/')
    .post(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), setPath('/brands'),
        uploader.single('image'), bodyValidator(BrandCreateDto), brandController.create)
    .get(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), brandController.index)

brandRoute.route('/:id')
    .get(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), brandController.checkauthor, brandController.show)
    .put(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), setPath('/brands'),
        uploader.single('image'), bodyValidator(BrandCreateDto), brandController.update)
    .delete(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), brandController.checkauthor, brandController.delete)


export default brandRoute