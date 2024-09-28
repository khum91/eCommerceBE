import { Router } from "express";
import checkLogin from "../../middleware/auth.middleware.js";
import allowUser from "../../middleware/rbac.middeleware.js";
import { UserTypes } from "../../config/constants.js";
import { uploader, setPath } from "../../middleware/uploader.middleware.js";
import bodyValidator from "../../middleware/validator.middleware.js";
import productCreateDto from "./product.request.js";
import productController from "./product.controller.js";

const productRoute = Router();

productRoute.route('/')
    .post(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), setPath('/products'),
        uploader.single('image'), bodyValidator(productCreateDto), productController.create)
    .get(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), productController.index)

productRoute.route('/options')
    .get(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), productController.options)
productRoute.route('/category/:id')
    .get(productController.productAsCategory)
productRoute.route('/single/:id')
    .get(productController.show)

productRoute.route('/:id')
    .get(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), productController.checkauthor, productController.show)
    .put(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), setPath('/products'),
        uploader.single('image'), bodyValidator(productCreateDto), productController.update)
    .delete(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), productController.checkauthor, productController.delete)


export default productRoute