import UserService from './user.service.js';

class UserController {
    userCreate = async (req, res, next) => {
        try {
            const data = UserService.transformUserCreate(req)
            await UserService.sendActivationEmail({ to: data.email, name: data.name, token: data.activationToken })
            res.json({
                result: data,
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