const Chat = require("../models/chat.model");
const uploadToCloudinary = require("../helper/uploadToCloudinary");

module.exports = async (req, res) => {
    const userId = res.locals.user.id;
    const userFullName = res.locals.user.fullName;
    const userAvatar = res.locals.user.avatar;
    const roomChatId = req.params.roomChatId || "chat_all" ;  
    // SocketIO
    _io.once('connection', async (socket) => {
        console.log("Có 1 user kết nối");
        // Add user vào phòng chat
        // Nếu có room chat id tức là chat private thì ta mới add
        // Còn không có tức là chat All thì không cần add vào  
        await socket.join(roomChatId);


        // CLIENT_SEND_MESSAGE 
        await socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            const images = [];
            if(data.images.length > 0){
                for (const image of data.images) {
                    const linkImage = await uploadToCloudinary(image);
                    images.push(linkImage);
                }
            }
            
            const newChat = new Chat({
                user_id: userId,
                room_chat_id: roomChatId ,
                content: data.content,
                images: images,
            })
            await newChat.save();
            // SEVER_SEND_UPDATE_LIST_ROOM
            // _io.emit("SEVER_SEND_UPDATE_LIST_ROOM", listRoomChat);

            // SEVER_RETURN_MESSAGE 
           await _io.to(roomChatId).emit("SEVER_RETURN_MESSAGE", {
                fullName: userFullName,
                user_id: userId,
                content: data.content,
                images: images,
                avatar: userAvatar
            })
            // End SEVER_RETURN_MESSAGE
        }) 
        // End CLIENT_SEND_MESSAGE   
        // CLIENT_SEND_TYPING
        await socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: userFullName,
                type: type,
                avatar: userAvatar
            });
        })
        // End CLIENT_SEND_TYPING  
    })
    // End SocketIO
}