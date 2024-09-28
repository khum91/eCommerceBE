import { Router } from "express";
import landingController from './landing.controller.js'
const landingRoute = Router();
landingRoute.route('/')
    .get(landingController.landing)
export default landingRoute