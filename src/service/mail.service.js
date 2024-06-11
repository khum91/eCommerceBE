import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()

class MailService {
    #transport;
    constructor() {
        try {
            this.#transport = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,

                // secure: true,
                // service:'gmail',

                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD
                }
            })

        } catch (exception) {
            console.log(exception)
            console.log('Error connecting to SMTP')
            throw {
                status: 500,
                message: 'Error connecting to SMTP',
                detail: exception
            }
        }
    }
    sendEmail = async ({ to, subject, message, attachments = null }) => {
        try {
            const msgOpts = {
                to: to,
                from: process.env.SMTP_FROM,
                subject: subject,
                html: message,
            };
            if (attachments) {
                msgOpts['attachments'] = attachments
            }

            await this.#transport.sendMail(msgOpts)
            return true

        } catch (exception) {
            console.log(exception)
            console.log('Error in sending mail')
            throw { status: 500, message: 'Error in sending mail', detail: exception }

        }

    }
}


const mailServ = new MailService()
export default mailServ;