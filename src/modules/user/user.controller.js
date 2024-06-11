import mailServ from '../../service/mail.service.js';
import UserService from './user.service.js';
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv';
dotenv.config()


import { randomString } from '../../utilities/helper.js'

class UserController {
    userCreate = async (req, res, next) => {
        try {
            // const data = UserService.transformUserCreate(req)

            const data = req.body
            data.password = await bcrypt.hash(data.password, 10)
            data.status = 'inactive'
            data.activationToken = randomString(30)
            data.activeFor = new Date(Date.now() + (3 * 36 * 36 * 1000))





            await mailServ.sendEmail({
                to: data.email,
                subject: "Testing Mail",
                message: `<p>Dear ${data.name},<p>
                <p>Your account has been created successfully.<p>
                <p>Please click in the link link below or copy the URL in the browser for further action.<p>
                <a href ='${process.env.FRONTEND_URL}/activate/${data.activationToken}'>
                ${process.env.FRONTEND_URL}/activate/${data.activationToken}</a>
                <hr/>
                <p>Regards</p>
                <p>System Admin</p>
                <p>${process.env.SMTP_FROM}</p>
                <p>
                <small>
                <em>Please do not reply to this email</em>
                </small>
                </p>`
            })

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