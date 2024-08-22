import joi from 'joi'
const loginDTO= joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
   })

   export default loginDTO