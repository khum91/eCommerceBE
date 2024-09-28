import { Router } from 'express';
import userRoute from '../modules/user/user.router.js';
import bannerRoute from '../modules/banner/banner.router.js';
import authRouter from '../modules/auth/auth.router.js';
import brandRouter from '../modules/brand/brand.router.js'
import categoryRoute from '../modules/category/category.router.js';
import productRoute from '../modules/product/product.router.js';
import chatRoute from '../modules/chat/chat.router.js';
import landRoute from '../modules/landing/landing.router.js';
import orderRoute from '../modules/order/order.router.js';


const route = Router();
route.use('/user', userRoute);
route.use('/banner', bannerRoute);
route.use('/auth', authRouter);
route.use('/brand', brandRouter);
route.use('/category', categoryRoute);
route.use('/product', productRoute);
route.use('/chat', chatRoute)
route.use('/landing', landRoute)
route.use('/order', orderRoute)




export default route;