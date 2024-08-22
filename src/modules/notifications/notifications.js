import mailServ from '../../service/mail.service.js'

class emailNotification {
    
    sendActivationEmail = async ({ to, name, token, sub = 'Activate your Account' }) => {
        try {
            return await mailServ.sendEmail({
                to: to,
                subject: sub,
                message: `<p>Dear ${name},<p>
            <p>Your account has been created successfully.<p>
            <p>Please click in the link link below or copy the URL in the browser for further action.<p>
            <a href ='${process.env.FRONTEND_URL}/auth/activate/${token}'>
            ${process.env.FRONTEND_URL}/auth/activate/${token}</a>
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

    sendPostActivationEmail = async ({ to, name }) => {
        try {
            return await mailServ.sendEmail({
                to: to,
                subject: 'Account Activated',
                message: `<p>Dear ${name},<p>
            <p>Your account has been activated successfully.<p>
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


const emailNotify = new emailNotification
export default emailNotify