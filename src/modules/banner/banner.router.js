import { Router } from "express";
import checkLogin from "../../middleware/auth.middleware.js";
import allowUser from "../../middleware/rbac.middeleware.js";
import { UserTypes } from "../../config/constants.js";
import { uploader, setPath } from "../../middleware/uploader.middleware.js";
import bodyValidator from "../../middleware/validator.middleware.js";
import BannerCreateDto from "./banner.request.js";
import bannerController from "./banner.controller.js";

const bannerRoute = Router();

//for Carousel
bannerRoute.get('/list-home',bannerController.listForHome)

bannerRoute.route('/')
    .post(checkLogin, allowUser([UserTypes.ADMIN, UserTypes.SELLER]), setPath('/banners'),
        uploader.single('image'), bodyValidator(BannerCreateDto), bannerController.create)
    .get(checkLogin, allowUser(UserTypes.ADMIN), bannerController.index)

bannerRoute.route('/:id')
    .get(checkLogin, allowUser(UserTypes.ADMIN), bannerController.show)
    .put(checkLogin, allowUser(UserTypes.ADMIN), setPath('/banners'),
        uploader.single('image'), bodyValidator(BannerCreateDto), bannerController.update)
    .delete(checkLogin, allowUser(UserTypes.ADMIN), bannerController.delete)


export default bannerRoute