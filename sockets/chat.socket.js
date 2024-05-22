const Chat = require("../models/chat.model");
const uploadToCloudinary = require("../helper/uploadToCloudinary");
module.exports = async (req, res) => {
    const userId = res.locals.user.id;
    const userFullName = res.locals.user.fullName;
    const userAvatar = res.locals.user.avatar;
    // SocketIO
    _io.once('connection', (socket) => {
        console.log("Có 1 user kết nối");
        // CLIENT_SEND_MESSAGE 
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            const images = [];
            if(data.images.length > 0){
                for (const image of data.images) {
                    const linkImage = await uploadToCloudinary(image);
                    images.push(linkImage);
                }
            }
            
            const newChat = new Chat({
                user_id: userId,
                // room_chat_id: String,
                content: data.content,
                images: images,
            })
            await newChat.save();

            // SEVER_RETURN_MESSAGE 
            _io.emit("SEVER_RETURN_MESSAGE", {
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
        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: userFullName,
                type: type,
                // avatar: avatar
            });
        })
        // End CLIENT_SEND_TYPING  
    })
    // End SocketIO
}