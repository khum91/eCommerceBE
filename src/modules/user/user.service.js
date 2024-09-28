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
        if (req.authUser) {
            data.createdBy = req.authUser._id
        }
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
                .populate('createdBy', ['_id', 'name'])
            return user
        } catch (e) {
            throw e
        }
    }

    getLoginUser = async (filter) => {
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
                        image: '$image',
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

    listAllData = async ({ limit = 10, skip = 0, sort = { _id: 'desc' }, filter = {} }) => {
        try {
            const data = await UserModel.find(filter)
                .populate('createdBy', ['_id', 'name'])
                .sort(sort)
                .skip(skip)
                .limit(limit)
            const count = await UserModel.countDocuments();
            return { data, count }
        } catch (error) {
            throw error
        }
    }

    updateById = async (id, data) => {
        try {
            const response = await UserModel.findByIdAndUpdate(id, { $set: data })
            return response
        } catch (error) {
            throw error
        }
    }

    deleteById = async (id) => {
        try {
            const response = await UserModel.findByIdAndDelete(id)
            if (!response) {
                throw { Status: 404, message: 'User does not exixts' }
            }
            return response
        } catch (error) {
            throw error
        }

    }
}


export default new UserService;