import { randomString } from '../../utilities/helper.js'
import bcrypt from 'bcryptjs'
import mailServ from '../../service/mail.service.js';
import dotenv from 'dotenv';
dotenv.config()

class UserService {
    transformUserCreate =(req) => {
        const data = req.body;
        data.password =  bcrypt.hash(data.password, 10)
        data.status = 'inactive'
        data.activationToken = randomString(30)
        data.activeFor = new Date(Date.now() + (3 * 36 * 36 * 1000))
        return data;
    }

    sendActivationEmail = async({to,name, token})=>{
    try {
      return await mailServ.sendEmail({
            to: to,
            subject: "Testing Mail",
            message: `<p>Dear ${name},<p>
            <p>Your account has been created successfully.<p>
            <p>Please click in the link link below or copy the URL in the browser for further action.<p>
            <a href ='${process.env.FRONTEND_URL}/activate/${token}'>
            ${process.env.FRONTEND_URL}/activate/${token}</a>
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

    } catch (e) {
        throw (e)
    }
}

}

export default new UserService;