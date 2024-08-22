import { Router } from 'express';
import userRoute from '../modules/user/user.router.js';
import bannerRoute from '../modules/banner/banner.router.js';
import authRouter from '../modules/auth/auth.router.js';
import brandRouter from '../modules/brand/brand.router.js'
import catagoryRoute from '../modules/catagory/catagory.router.js';
import chatRoute from '../modules/chat/chat.router.js';


const route = Router();
route.use('/user', userRoute);
route.use('/banner', bannerRoute);
route.use('/auth', authRouter);
route.use('/brand', brandRouter);
route.use('/catagory', catagoryRoute);
route.use('/chat', chatRoute)


export default route;