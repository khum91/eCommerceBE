import { Router } from 'express';
import userRoute from '../modules/user/user.router.js';
import bannerRoute from '../modules/banner/banner.router.js';


const route = Router();
route.use('/user', userRoute);
route.use('/banner', bannerRoute);



export default route;