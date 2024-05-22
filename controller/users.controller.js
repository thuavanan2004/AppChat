const Account = require("../models/account.model");
const usersSocket = require("../sockets/users.socket");


// [GET] /users/not-friends 
module.exports.notFriends = async (req, res) => {
    try{
        // SocketIO
            usersSocket(req, res);
        // End SocketIO

        const userId = res.locals.user.id;
        const requestFriends = res.locals.user.requestFriends;
        const acceptFriends = res.locals.user.acceptFriends;
        const friendsList = res.locals.user.friendsList.map(user => user.user_id)


        const users = await Account.find({
            $and: [
                {_id: {$ne: userId}},// not equal
                {_id: {$nin: requestFriends}}, // not in
                {_id: {$nin: acceptFriends}}, // not in
                {_id: {$nin: friendsList}} // not in
              ],
            deleted: false
        }).select("fullName avatar");
        
        res.render("pages/users/not-friends.pug", {
            pageTitle: "Danh sách người dùng",
            users: users
        });
    }catch {
        res.redirect("/");
        return;
    }
    
}

// [GET] /users/friends 
module.exports.friends = async (req, res) => {
    // SocketIO
    usersSocket(req, res);
    // End SocketIO
    const friendsList = res.locals.user.friendsList.map(user => user.user_id);
    const users = await Account.find({
        _id: {$in: friendsList},
        deleted: false
    }).select("avatar fullName statusOnline");

    res.render("pages/users/friends.pug", {
        pageTitle: "Danh sách bạn bè",
        users: users
    });
}

// [GET] /users/request 
module.exports.request = async (req, res) => {
    // SocketIO
    usersSocket(req, res);
    // End SocketIO
    const requestFriends = res.locals.user.requestFriends;
    
    const users = await Account.find({
        _id: {$in: requestFriends},
        deleted: false,
    }).select("avatar fullName");

    res.render("pages/users/request.pug", {
        pageTitle: "Lời mời đã gửi",
        users: users
    });
}

// [GET] /users/accept 
module.exports.accept = async (req, res) => {
    // SocketIO
    usersSocket(req, res);
    // End SocketIO
    const acceptFriends = res.locals.user.acceptFriends;
    const users = await Account.find({
        _id: {$in: acceptFriends},
        deleted: false
    }).select("avatar fullName")
    
    res.render("pages/users/accept.pug", {
        pageTitle: "Lời mời đã gửi",
        users: users
    });
}