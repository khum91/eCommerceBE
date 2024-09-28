import userService from './user.service.js';
import UserService from './user.service.js';
import { deleteFile } from "../../utilities/helper.js";

class UserController {
    #id;
    #user;
    userCreate = async (req, res, next) => {
        try {
            const data = UserService.transformUserCreate(req)
            const user = await UserService.storeUser(data)
            //for temporary
            // await emailNotify.sendActivationEmail({ to: user.email, name: user.name, token: user.activationToken })
            res.json({
                result: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    activationToken: user.activationToken,
                    activeFor: user.activateFor
                },
                message: "User Create",
                meta: null
            });

        } catch (e) {
            next(e)
        }
    }

    index = async (req, res, next) => {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;

            const sorting = { _id: 'desc' }
            let filter = {}

            if (req.query.search) {
                filter = {
                    $or: [{ name: new RegExp(req.query.search, 'i') },
                    { status: new RegExp(req.query.search, 'i') }]
                }
            }
            const { data, count } = await UserService.listAllData({
                limit: limit,
                skip: skip,
                sort: sorting,
                filter: filter
            })
            res.json({
                result: data,
                message: 'User List',
                meta: {
                    currentPage: page,
                    total: count,
                    limit: limit,
                    totalPages: Math.ceil(count / limit)
                }
            })
        } catch (error) {
            next(error)
        }
    }

    #validateId = async (req) => {
        try {
            this.#id = req.params.id;
            this.#user = await UserService.getSingleUserByFilter({ _id: this.#id })
            if (!this.#user) {
                throw { status: 404, message: 'User not found' }
            }
        } catch (e) {
            throw e
        }
    }

    userDetails = async (req, res) => {
        try {
            await this.#validateId(req)
            res.json({
                result: this.#user,
                message: 'User Detail',
                meta: null
            })
        } catch (error) {
            throw error
        }
    };

    userUpdate = async (req, res) => {
        try {
            await this.#validateId(req)
            const data = req.body
            if (req.file) {
                data.image = req.file.filename
            }
            const response = await userService.updateById(this.#id, data)
            if (req.file) {
                deleteFile('./public/uploads/users/' + response.image)
            }
            res.json({
                result: data,
                message: 'User Updated Successfully',
                meta: null
            })

        } catch (error) {
            throw error
        }
    };

    userDelete = async (req, res) => {
        try {
            this.#id = req.params.id;
            const response = await UserService.deleteById(this.#id)
            if (response.image) {
                deleteFile('./public/uploads/users/' + response.image)
            }

            res.json({
                result: null,
                message: 'User deleted successfully.',
                meta: null
            })
        } catch (error) {
            // next(error)
        }
    };

}
const userControl = new UserController();
export default userControl;