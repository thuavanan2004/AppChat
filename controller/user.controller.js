const Account = require("../models/account.model");
const chatSocket = require("../sockets/chat.socket");

// [GET] /user/info
module.exports.info = async (req, res) => {
    // SocketIO
    await chatSocket(req, res);
    // End SocketIO

    res.render("pages/user/info", {
        pageTitle: "Thông tin tài khoản"
    })
}

// [GET] /user/edit
module.exports.edit = async (req, res) => {
    // SocketIO
    await chatSocket(req, res);
    // End SocketIO

    res.render("pages/user/edit", {
        pageTitle: "Thông tin tài khoản"
    })
}

// [PATCH] /user/edit
module.exports.editPatch = async (req, res) => {
    // SocketIO
    await chatSocket(req, res);
    // End SocketIO
    const userId = req.params.userId;
    try{
        await Account.updateOne({
            _id: userId,
            deleted: false
        }, req.body )
        req.flash("success", "Cập nhật thông tin thành công!")
        res.redirect("back");
    }catch {
        req.flash("error", "Cập nhật thông tin không thành công!")
        return;

    }
}