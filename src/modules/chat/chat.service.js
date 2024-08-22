import { ChatModel } from "./chat.model.js";

class ChatService {
    detailBySender = async (filter) => {
        try {
            const list = await ChatModel.find(filter)
                .populate('sender', ['_id', 'name', 'email', 'role'])
                .populate('receiver', ['_id', 'name', 'email', 'role'])
                .sort({ date: 'asc' })
            return list;
        } catch (error) {
            throw error
        }
    }

    detailById = async (id) => {
        try {
            const list = await ChatModel.find(id)
                .populate('sender', ['_id', 'name', 'email', 'role'])
                .populate('receiver', ['_id', 'name', 'email', 'role'])
                .sort({ date: 'asc' })
            return list;
        } catch (error) {
            throw error
        }
    }


    storeChat = async (data) => {
        try {
            const chat = new ChatModel(data);
            await chat.save()
            return await this.detailById(chat._id)
        } catch (e) {
            throw e
        }
    }
}

export default new ChatService();