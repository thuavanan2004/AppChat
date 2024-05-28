const RoomChat = require("../models/rooms-chat.model");


module.exports.isAccess = async (req, res, next) => {
    const userId = res.locals.user.id;
    const roomChatId = req.params.roomChatId;
    try {
        const roomChat = await RoomChat.findOne({
            _id: roomChatId,
            "users.user_id": userId,
            deleted: false
        })
        if(!roomChat) {
            res.redirect("/")
            return;
        }
        next();
    } catch(error) {
        res.redirect("/");
    }
   
}