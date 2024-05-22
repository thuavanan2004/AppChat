const Account = require("../models/account.model");


module.exports = async (req, res) => {
    const userIdA = res.locals.user.id;

    _io.once("connection", async (socket) => {
        // Khi A gửi yêu cầu cho B
        socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
            // Thêm id của A vào acceptFriends của B
            const existAInB = await Account.findOne({
                _id: userIdB,
                acceptFriends: userIdA
            })
            if(!existAInB) {
                await Account.updateOne({
                    _id: userIdB
                }, {
                    $push: { acceptFriends: userIdA }
                })
            }

            // Thêm id của B vào requestFriends của A
            const existBInA = await Account.findOne({
                _id: userIdA,
                requestFriends: userIdB
            })
            if(!existBInA) {
                await Account.updateOne({
                    _id: userIdA
                }, {
                    $push: { requestFriends: userIdB }
                })
            }
            // Lấy số user (độ dài) trong acceptFriends của B trả về cho B
            const infoB = await Account.findOne({
                _id: userIdB,
                deleted: false
            });
            const lengthAcceptFriends = infoB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userIdB,
                lengthAcceptFriends: lengthAcceptFriends
            });
            // Lấy thông tin của A để trả về cho B
            const infoUserA = await Account.findOne({
                _id: userIdA,
                deleted: false
            }).select("fullName avatar")
            
            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userIdB: userIdB,
                infoUserA: infoUserA
            })
            
        })

        // Khi A huy yêu cầu kết bạn với B
        socket.on("CLIENT_CANCEL_FRIEND", async (userIdB) => {
            
            // Xóa id của A trong acceptFriends của B
            await Account.updateOne({
                _id: userIdB
            }, {
                $pull: {acceptFriends: userIdA}
            })
            // Xóa id của B trong requestFriends của A
            await Account.updateOne({
                _id: userIdA
            }, {
                $pull: {requestFriends: userIdB}
            })
            // Lấy độ dài acceptFriends của B trả về cho B
            const infoB = await Account.findOne({
                _id: userIdB
            });
            const lengthAcceptFriends = infoB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userIdB,
                lengthAcceptFriends: lengthAcceptFriends
            });
            // Lấy id của A để trả về cho B
            socket.broadcast.emit("SERVER_RETURN_CANCEL_FRIEND", {
                userIdB: userIdB,
                userIdA: userIdA
            });
        })

        //Khi A từ chối kết bạn với B
        socket.on("CLIENT_REFUSE_FRIEND", async (userIdB) => {
            
             // Xóa id của B trong acceptFriends của A
            await Account.updateOne({
                _id: userIdA
            }, {
                $pull: {acceptFriends: userIdB}
            })

            // Xóa id của A trong requestFriends của B
            await Account.updateOne({
                _id: userIdB
            }, {
                $pull: {requestFriends: userIdA}
            })
        })

        //Khi A chấp nhận kết bạn với B
        socket.on("CLIENT_ACCEPT_FRIEND", async (userIdB) => {
            
            // Thêm {user_id, room_chat_id} của B vào friendsList của A
            // Xóa id của B trong acceptFriends của A
            await Account.updateOne({
                _id: userIdA
            },{
                $push: {
                    friendsList: {
                        user_id: userIdB,
                        room_chat_id: ""
                    }
                },
                $pull: { acceptFriends: userIdB }
            })

            // Thêm {user_id, room_chat_id} của A vào friendsList của B
            // Xóa id của A trong requestFriends của B
            await Account.updateOne({
                _id: userIdB
            }, {
                $push: {
                    friendsList: {
                        user_id: userIdA,
                        room_chat_id: ""
                    }
                },
                $pull: {requestFriends: userIdA}
            })
            // Lấy số user (độ dài) trong friendsList của B trả về cho B
            const infoB = await Account.findOne({
                _id: userIdB,
                deleted: false
            });
            const lengthAcceptFriends = infoB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userIdB,
                lengthAcceptFriends: lengthAcceptFriends
            });
        })

        
    }) 
}