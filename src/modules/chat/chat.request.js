import joi from "joi";

const ChatCreateDTO = joi.object({
    sender: joi.string().required(),
    receiver: joi.string().required(),
    message: joi.string().min(1).required()
});

export default ChatCreateDTO;