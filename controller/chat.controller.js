const chatSocket = require("../sockets/chat.socket");

                                                                                
// [GET] /
module.exports.home = async (req, res) => {

    // SocketIO
    chatSocket(req, res);
    // End SocketIO

    res.render("pages/home/index", {
        pageTitle: "Trang chủ",
    })
}