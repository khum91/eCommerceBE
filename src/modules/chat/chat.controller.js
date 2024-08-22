import userService from "../user/user.service.js";
import chatService from "./chat.service.js";

class ChatController {
    chatList = async (req, res, next) => {
        try {
            // TODO pagination and Search
            const LoggedInUser = req.authUser;
            const userList = await userService.listAllByFilter({
                _id: { $ne: LoggedInUser._id }
            })
            res.json({
                result: userList,
                meta: null,
                message: 'List of Users'
            })

        } catch (e) {
            next(e)
        }
    }

    listDetail = async (req, res, next) => {
        try {
            const senderId = req.params.senderId;
            const sender = await userService.getSingleUserByFilter({ _id: senderId })
            const loggedInUser = req.authUser;
            const list = await chatService.detailBySender({
                $or: [
                    { sender: senderId, receiver: loggedInUser._id },
                    { sender: loggedInUser._id, receiver: senderId }
                ]
            })
            res.json({
                result: { list, sender },
                meta: null,
                message: 'chat details'
            })
        } catch (e) {
            next(e)
        }
    }

    createChat = async (req, res, next) => {
        try {
            const data = req.body;
            const chat = await chatService.storeChat(data)
            res.json({
                result: chat,
                message: 'chat sent successfully',
                meta: null
            })

        } catch (e) {
            next(e)
        }
    }

}
export default new ChatController;