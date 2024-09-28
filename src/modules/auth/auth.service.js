import userService from "../user/user.service.js";
import patModel from "./pat.model.js";

class AuthService {
    validateActivationToken = async (token) => {
        try {
            if (!token) {
                throw { status: 400, message: 'Token required for activation' };
            }
            const user = await userService.getLoginUser({ activationToken: token })
            if (!user) {
                throw { status: 404, message: 'Token not found or broken' }
            }
            return user

        } catch (error) {
            console.log(error)
            throw error
        }
    }
    populatePat = async (userId, { token, refreshToken }) => {
        try {
            const pat = new patModel({
                userId: userId,
                accessToken: token,
                refreshToken: refreshToken
            })
            return await pat.save()
        } catch (error) {
            throw (error)

        }
    }

    getPatData = async (filter) => {
        try {
            const pat = await patModel.findOne(filter)
            return pat
        } catch (error) {
            throw error
        }
    }

    deletePat = async (filter) => {
        try {
            return await patModel.deleteMany(filter)
        } catch (error) {
            throw error
        }
    }

}

const authService = new AuthService;
export default authService;