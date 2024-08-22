import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config()
import userService from '../modules/user/user.service.js';
import authService from '../modules/auth/auth.service.js';

const checkLogin = async (req, res, next) => {
    try {
        let token = req.headers['authorization'] || null
        if (!token) {
            throw { status: 401, message: 'Token Expected' }
        }
        token = token.split(' ').pop()
        //Pat store
        const pat = await authService.getPatData({ accessToken: token })


        if (pat) {
            const data = jwt.verify(token, process.env.JWT_SECRET)
            const userExists = await userService.getSingleUserByFilter({ _id: data.sub })
            if (!userExists) {
                throw { status: 401, message: 'User does not exists anymore.' }
            } else {
                req.authUser = {
                    _id: userExists._id,
                    name: userExists.name,
                    email: userExists.email,
                    role: userExists.role,
                    image: userExists.image,
                    phone: userExists.phone,
                    address: userExists.address,
                    userProvider: userExists.userProvider,
                    userProviderId: userExists.userProviderId
                }
                req.currentSession = pat;
                next()
            }
        } else {
            throw { status: 401, message: 'Token does not exists or broken' }
        }
    } catch (error) {
        next({ status: error.status || 401, message: error.message })
    }
}
export default checkLogin;