const moment = require('moment'); 
const chatSocket = require("../sockets/chat.socket");
const Account = require("../models/account.model");
const Chat = require("../models/chat.model");
const RoomChat = require("../models/rooms-chat.model");
                                                                                
// [GET] /
module.exports.chatAll = async (req, res) => {
    // SocketIO
    await chatSocket(req, res);
    // End SocketIO
    
    res.render("pages/home/index", {
        pageTitle: "Trang chủ", 
    })
}
 
// [GET] /:roomChatId
module.exports.chatPrivate = async (req, res) => {
    // SocketIO
    await chatSocket(req, res);  
    // End SocketIO

    const userId = res.locals.user.id;
    const roomChatId = req.params.roomChatId;
    const chats = await Chat.find({
        deleted: false,
        room_chat_id: roomChatId
    })
    const roomChat = await RoomChat.findOne({
        _id: roomChatId
    })  

    if(!roomChat.title){
        const userIdChat =  roomChat.users.find(user => user.user_id != userId);
        const userChat = await Account.findOne({
            _id: userIdChat.user_id
        }).select("fullName avatar statusOnline");
        roomChat.userFullNameReceive = userChat.fullName;
        roomChat.userAvatarReceive = userChat.avatar;
        roomChat.statusOnline = userChat.statusOnline;
    } 

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
    res.render("pages/home/index", {
        pageTitle: "Trang chủ",
        chats: chats,
        roomChat: roomChat
    })
}

// [POST] /create
module.exports.createPost = async (req, res) => {
    const userId = res.locals.user.id;
    const roomChat = {
        title: req.body.title,
        avatar: req.body.avatar,
        typeRoom: "group",
        users: [
            {
                user_id: userId,
                role: "superAdmin"
            }
        ],
    }
    
    req.body.usersId.forEach(id => {
        roomChat.users.push({
            user_id: id,
            role: "user"
        })
    });
    const newRoomChat = new RoomChat(roomChat);
    await newRoomChat.save();
    res.redirect(`/${newRoomChat.id}`);
} 