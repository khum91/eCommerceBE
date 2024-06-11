import { Router } from 'express';
import bannerControl from './banner.controler.js';


const bannerRoute = Router();

bannerRoute.route('/')


    .get(bannerControl.bannerList)

    //Create User
    .post(bannerControl.bannerCreate);

//for  '/:id' pattern
bannerRoute.route('/:id')

    // User Details
    .get(bannerControl.bannerDetails)

    //User Update
    .put(bannerControl.bannerUpdate)

    //User Delete
    .delete(bannerControl.bannerDelete);

export default bannerRoute;