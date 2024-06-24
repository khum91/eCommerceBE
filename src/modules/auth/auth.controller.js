import { json } from "express";
import { randomString } from "../../utilities/helper.js";
import userService from "../user/user.service.js";
import authService from "./auth.service.js";
import { GeneralStatus } from "../../config/constants.js";
import emailNotify from '../notifications/notifications.js'

class AuthController {
    activateUser = async (req, res, next) => {
        try {
            const token = req.params.token;
            const user = await authService.validateActivationToken(token)
            const tokenCreatedAt = user.activateFor.getTime()
            const today = Date.now()
            if (tokenCreatedAt < today) {
                throw { status: 400, message: 'Token expired' }
            }

            // To Activate
            user.activationToken = null,
                user.activateFor = null,
                user.status = GeneralStatus.ACTIVE

            await user.save()
            await emailNotify.sendPostActivationEmail({
                to: user.email, name: user.name
            })

            res.json({
                result: null,
                message: 'Your Account has been activated successfully. Please login to further process.'
            })

        } catch (e) {
            next(e)
        }
    }

    resendActivationToken = async (req, res, next) => {
        try {
            const token = req.params.token || null
            const user = await authService.validateActivationToken(token)
            user.activationToken = randomString(40)
            user.activateFor = new Date(Date.now() + (3 * 36 * 36 * 1000))

            await user.save() //Update
            await emailNotify.sendActivationEmail({
                to: user.email, name: user.name,
                token: user.activationToken, sub: 'Re-Activate your Account'
            })

            res.json({
                result: null,
                message: "A new reactivation link has been forwarded in your email. Please proceed for further action"
            })
        } catch (error) {
            next(error)
        }
    }
}
const authControl = new AuthController();
export default authControl