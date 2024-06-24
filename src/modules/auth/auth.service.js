import userService from "../user/user.service.js";

class AuthService {
    validateActivationToken = async (token) => {
        try {
            if (!token) {
                throw { status: 400, message: 'Token required for activation' };
            }
            const user = await userService.getSingleUserByFilter({ activationToken: token })
            if (!user) {
                throw { status: 404, message: 'Token not found or broken' }
            }
            return user

        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

const authService = new AuthService;
export default authService;