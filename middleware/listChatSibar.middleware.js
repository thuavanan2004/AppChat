const RoomChat = require("../models/rooms-chat.model");
const moment = require('moment'); 
const Account = require("../models/account.model");
const Chat = require("../models/chat.model");

module.exports.listChat = async (req, res, next) => { 
    try {
        const userId = res.locals.user.id;
        const userIds = res.locals.user.friendsList.map(user => user.user_id);
        const friendsList = res.locals.user.friendsList;

        const listUserOnline = await Account.find({
            _id: {$in: userIds},
            statusOnline: "online"
        }).select("fullName avatar friendsList");

        listUserOnline.forEach(users => {
            const user = users.friendsList.find(item => item.user_id == userId);
            users.room_chat_id = user.room_chat_id;
            users.name = users.fullName.split(" ")[users.fullName.split(" ").length - 1];
        })
        
       
        for (const friend of friendsList) {
            const user = await Account.findOne({
                _id: friend.user_id
            }).select("fullName avatar")
            friend.fullName = user.fullName;  
            friend.avatar = user.avatar; 
        } 

        const listRoomChat = await RoomChat.find({
            "users.user_id": userId,
            deleted: false
        });
        
        const updatedRooms = await Promise.all(listRoomChat.map(async (roomChat) => {
            if (!roomChat.title) {
                const userIdChat = roomChat.users.find(user => user.user_id != userId);
                const userChat = await Account.findOne({
                    _id: userIdChat.user_id
                }).select("fullName avatar statusOnline");
               
                roomChat.title = userChat.fullName;
                roomChat.avatar = userChat.avatar;
                roomChat.statusOnline = userChat.statusOnline;
            } else {
                const userIdInRoomChat = roomChat.users.map(user => user.user_id);
                const users = await Account.find({
                    _id: {$in: userIdInRoomChat}
                }).select("statusOnline");
                const userOnline = users.find(user => user.statusOnline == "online");
                roomChat.statusOnline = userOnline.statusOnline;
            }

            const chat = await Chat.findOne({
                room_chat_id: roomChat._id
            }).sort({ createdAt: -1 });

            if (chat) {
                if(chat.content != ''){
                    roomChat.contentAt = chat.content;
                }else {
                    if(chat.user_id == userId){
                        roomChat.contentAt = "Bạn đã gửi một ảnh";
                    }else {
                        const userSendLatest = await Account.findOne({
                            _id: chat.user_id,
                            deleted: false
                        }).select("fullName");
                        const nameSend = userSendLatest.fullName.split(" ")[userSendLatest.fullName.split(" ").length - 1];
                        roomChat.contentAt = `${nameSend} gửi một ảnh`;
                    }
                    
                }
                
                roomChat.sendAt = moment(chat.createdAt).format("LT");
                roomChat.lastMessageTime = chat.createdAt;  // thêm thuộc tính này để sắp xếp sau này
            } else {
                roomChat.lastMessageTime = new Date(0);  // nếu không có tin nhắn, đặt thời gian là rất cũ
            }

            return roomChat;
        }));

        // Sắp xếp các phòng chat theo thời gian tin nhắn gần đây nhất
        updatedRooms.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
        res.locals.friendsList = friendsList
        res.locals.listUserOnline = listUserOnline; 
        res.locals.listRoomChat = updatedRooms;
        next();
    } catch (error) {
        next();
    }
}