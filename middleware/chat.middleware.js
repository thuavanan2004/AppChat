const moment = require('moment'); 
const Account = require("../models/account.model");
const Chat = require("../models/chat.model");


module.exports.chatAll = async (req, res, next) => {
    const chats = await Chat.find({
        deleted: false,
        room_chat_id: "chat_all"
    });
    const roomChat = {};
    roomChat.contentAt = chats[chats.length -1].content;
    roomChat.sendAt = moment(chats[chats.length -1].createdAt).format("LT");
    for (const chat of chats) {
        try{
            const user = await Account.findOne({
                _id: chat.user_id
            })
            chat.userFullName = user.fullName;
            if(user.avatar){
                chat.avatar = user.avatar;
            }
        }catch {
            return;
        }
    }

    res.locals.roomChat = roomChat;
    res.locals.chats = chats; 
    
    
    next();
}


