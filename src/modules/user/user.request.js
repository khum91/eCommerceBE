import joi from 'joi';


const UserCreateDto= joi.object({
    name: joi.string().regex(/^[a-zA-Z ]+$/).min(6).max(50).required().messages({
        'string.empty':"Name is Compulsory"
    }),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(25).required(),
    confirmPassword: joi.string().equal(joi.ref('password')).required(),
    address: joi.string().optional().required(),
    phone: joi.string().min(10).max(15),
    image: joi.string().optional(),
    role: joi.string().regex(/^(admin|seller|customer)$/).optional()
});


export default UserCreateDto;