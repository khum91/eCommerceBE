import { Router } from 'express';
import checkLogin from '../../middleware/auth.middleware.js';
import chatController from './chat.controller.js';
import bodyValidator from '../../middleware/validator.middleware.js';
import ChatCreateDTO from './chat.request.js';


const chatRoute = Router();
chatRoute.get('/chat-list', checkLogin, chatController.chatList)
chatRoute.get('/chat-detail/:senderId', checkLogin, chatController.listDetail)
chatRoute.post('/store', checkLogin, bodyValidator(ChatCreateDTO), chatController.createChat)

export default chatRoute