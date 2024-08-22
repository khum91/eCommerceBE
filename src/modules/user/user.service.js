import { randomString } from '../../utilities/helper.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv';
dotenv.config()

import { UserModel } from './user.model.js';

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
            const user = await UserModel.findOne(filter)
            return user
        } catch (e) {
            throw e
        }
    }

    listAllByFilter = async (filter) => {
        try {
            const list = await UserModel.aggregate([
                {
                    '$match': {
                        ...filter
                    }
                }, {
                    '$lookup': {
                        'from': 'chats',
                        'localField': '_id',
                        'foreignField': 'receiver',
                        'as': 'message'
                    }
                }, {
                    '$project': {
                        _id: '$_id',
                        name: '$name',
                        email: '$email',
                        role: '$role',
                        status: '$status',
                        message: '$message'
                    }
                }
            ])


            // const list = await UserModel.find(filter, { password: 0, __v: 0, activationToken: 0, activateFor: 0, createdAt: 0, updatedAt: 0 })
            return list;
        } catch (e) {
            throw e
        }
    }
}


export default new UserService;