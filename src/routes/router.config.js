import { Router } from 'express';
import userRoute from '../modules/user/user.router.js';
import bannerRoute from '../modules/banner/banner.router.js';
import authRouter from '../modules/auth/auth.router.js';


const route = Router();
route.use('/user', userRoute);
route.use('/banner', bannerRoute);
route.use('/auth',authRouter);



export default route;