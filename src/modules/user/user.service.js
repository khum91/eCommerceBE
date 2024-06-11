import { randomString } from '../../utilities/helper.js'
import bcrypt from 'bcryptjs'

class UserService {
    transformUserCreate = async (req) => {
        const data = req.body;
        data.password = await bcrypt.hash(data.password, 10)
        data.status = 'inactive'
        data.activationToken = randomString(30)
        data.activeFor = new Date(Date.now() + (3 * 36 * 36 * 1000))
        return data;
    }

}



export default new UserService;