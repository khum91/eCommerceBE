import { Router } from "express";
import { UserTypes } from "../../config/constants.js";
import checkLogin from "../../middleware/auth.middleware.js";
import allowUser from "../../middleware/rbac.middeleware.js";
import orderController from "./order.controller.js";

const orderRoute = Router();

orderRoute.route('/')
    .post(checkLogin, allowUser(UserTypes.CUSTOMER), orderController.create)
    .get(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), orderController.index)
orderRoute.route('/customer')
    .get(checkLogin, allowUser([UserTypes.CUSTOMER]), orderController.customer)
orderRoute.route('/customer/:id')
    .get(checkLogin, allowUser([UserTypes.CUSTOMER]), orderController.show)

orderRoute.route('/:id')
    .get(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), orderController.show)
    .put(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), orderController.update)

export default orderRoute