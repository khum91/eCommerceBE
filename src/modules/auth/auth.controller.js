import { randomString } from "../../utilities/helper.js";
import authService from "./auth.service.js";
import { GeneralStatus } from "../../config/constants.js";
import emailNotify from '../notifications/notifications.js'
import userService from "../user/user.service.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

class AuthController {
    activateUser = async (req, res, next) => {
        try {
            const token = req.params.token;
            const user = await authService.validateActivationToken(token)
            const tokenCreatedAt = user.activateFor.getTime()
            const today = Date.now()
            if (tokenCreatedAt < today) {
                throw { status: 400, detail:{token:'expired'}, message: 'Token expired' }
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

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body
            const userExists = await userService.getSingleUserByFilter({ email: email })

            if (!userExists) {
                throw { status: 400, message: 'Invalid credentials provided' }
            }
            if (userExists && userExists.status === GeneralStatus.ACTIVE) {
                if (bcrypt.compareSync(password, userExists.password)) {

                    const token = jwt.sign({ sub: userExists._id, type: 'bearer' }, process.env.JWT_SECRET,
                        { expiresIn: '3h' })

                    const refreshToken = jwt.sign({ sub: userExists._id, type: 'refresh' }, process.env.JWT_SECRET,
                        { expiresIn: '1day' })

                    //pat table populate
                    await authService.populatePat(userExists._id, { token, refreshToken })

                    res.json({
                        result: {
                            userDetail: {
                                _id: userExists._id,
                                name: userExists.name,
                                email: userExists.email,
                                role: userExists.role,
                                image: userExists.image
                            },
                            token: {
                                access: token,
                                refresh: refreshToken
                            }
                        },
                        message: "You have been successfully loggedin.",
                        meata: null
                    })

                } else {
                    throw { status: 400, message: 'Invalid credentials does not match' }
                }

            } else {
                throw { status: 400, message: 'User not activated' }
            }

        } catch (error) {
            next(error)
        }
    }

    getLoggedInUser = async (req, res, next) => {
        try {
            res.json({
                result: req.authUser,
                meta: null,
                message: 'Your Profile'

            })
        } catch (error) {
            next(error)
        }
    }

    logout = async (req, res, next) => {
        try {
            const authUser = req.authUser
            const currentPat = req.currentSession
            const query = req.query.logout || null
            if (query === 'all') {
                // logout from all session
                await authService.deletePat({ userId: authUser._id })
            } else {
                // logout from current session
                await authService.deletePat({ _id: currentPat._id })
            }
            res.json({
                result:null,
                message:"Loggout successfully"
            })
        } catch (error) {
            next(error)
        }
    }

}
const authControl = new AuthController();
export default authControl