import Chat from '../models/Chat.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import { handleError } from '../error.js';

export const createChat = async (req, res, next) => {
    if (req.user.id === req.params.id){
        return res.status(403).json({
            message: 'You cannot create a chat with yourself',
        });
    }
    const receiver = await User.findById(req.params.id);
    if (!receiver) {
        return res.status(404).json({
            message: 'User not found',
        });
    }
    const oldOne = await Chat.findOne({userIds: [req.user.id, req.params.id]});
    const oldTwo = await Chat.findOne({userIds: [req.params.id, req.user.id]});

    if (oldOne || oldTwo) {
        return res.status(403).json({
            message: 'Chat already exists',
        });
    }
    const chat = new Chat({
        userIds: [req.user.id, req.params.id],
    });
    const user = await User.findById(req.user.id);
    try {
        await receiver.updateOne({$push: {chats: chat._id}});
        await receiver.save();
        await user.updateOne({$push: {chats: chat._id}});
        await user.save();
        const savedChat = await chat.save();
        res.status(200).json(savedChat);
    } catch (err) {
        next(err);
    }
};

export const deleteChat = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(403).json({
                message: 'Chat not found',
            });
        }
        if (![chat.userIds[0], chat.userIds[1]].includes(req.user.id)){
            return res.status(403).json({
                message: 'You are not allowed to delete this chat',
            });
        }

        const one = await User.findById(chat.userIds[0]);
        const two = await User.findById(chat.userIds[1]);
        await one.updateOne({$pull: {chats: chat._id}});
        await one.save();
        await two.updateOne({$pull: {chats: chat._id}});
        await two.save();

        await chat.deleteOne();
        res.status(200).json({
            message: 'Chat deleted',
        });
    } catch (err) {
        next(err);
    }
};

export const sendMessage = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(403).json({
                message: 'Chat not found',
            });
        }
        if (![chat.userIds[0], chat.userIds[1]].includes(req.user.id)){
            return res.status(403).json({
                message: 'You are not allowed to send this message',
            });
        }
        const message = new Message({
            text: req.body.text,
            senderId: req.user.id,
            receiverId: chat.userIds.filter(id => id!== req.user.id)[0],
            chatId: chat.id
        });
        const savedMessage = await message.save();        
        await chat.updateOne({$push: {messageIds: savedMessage._id}});
        await chat.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        next(err);
    }
};

export const getMessage = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(403).json({
                message: 'Message not found',
            });
        }
        if (![message.senderId, message.receiverId].includes(req.user.id)){
            return res.status(403).json({
                message: 'You are not allowed to view this message',
            });
        }
        res.status(200).json(message);
    } catch (err) {
        next(err);
    }
};