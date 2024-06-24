import { randomString } from '../../utilities/helper.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv';
dotenv.config()

import  {UserModel} from './user.model.js';

class UserService {
    transformUserCreate = (req) => {
        const data = req.body;
        data.password = bcrypt.hashSync(data.password, 10)
        data.status = 'inactive'
        data.activationToken = randomString(30)
        data.activateFor = new Date(Date.now() + (3 * 36 * 36 * 1000))
        return data;
    }

    
    storeUser = async (data) => {
        try {
            const user = new UserModel(data);
            return await user.save()
        } catch (e) {
            console.log(e)
            throw e
        }
    }


    getSingleUserByFilter = async (filter) => {
        try {
            const user = await UserModel.findOne(filter, { password: 0 })
            return user
        } catch (e) {
            throw e
        }
    }
}


export default new UserService;