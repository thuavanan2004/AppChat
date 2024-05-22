const Account = require("../models/account.model");
const Chat = require("../models/chat.model");

module.exports.chat = async (req, res, next) => {
    

    const chats = await Chat.find({
        deleted: false
    })
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

    res.locals.chats = chats;
    next();
}