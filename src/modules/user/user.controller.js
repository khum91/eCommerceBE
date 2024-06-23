import UserService from './user.service.js';

class UserController {
    userCreate = async (req, res, next) => {
        try {
            const data = UserService.transformUserCreate(req)
            const user = await UserService.storeUser(data)

            await UserService.sendActivationEmail({ to: user.data.email, name: user.data.name, token: user.data.activationToken })
            res.json({
                result: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    activationToken: user.activationToken,
                    activeFor: user.activeFor
                },
                message: "User Create",
                meta: null
            });

        } catch (e) {
            next(e)
        }
    }
    userList = (req, res) => {
        res.json({
            result: null,
            message: "User Listing",
            meta: null
        });

    };

    userDetails = (req, res) => {
        const params = req.params;
        const query = req.query;

        res.json({
            result: {
                params: params,
                query: query,
            },
            message: 'user details of ' + params.id,
            meta: null

        })

    };

    userUpdate = (req, res) => {
        res.json({
            result: {
                Headers: req.header,
            },
            message: "User Update",
            meta: null
        });
    };

    userDelete = (req, res) => {
        res.json({
            result: null,
            message: "User Delete",
            meta: null
        });
    };

}
const userControl = new UserController();
export default userControl;