const generateTokenHelper = require("../helper/generateToken.helper");
const Account = require("../models/account.model");
const md5 = require('md5');


//[GET] /auth/login
module.exports.login = (req, res) => {

    res.render("auth/login.pug", {
        pageTile: "Đăng nhập"
    })
}

//[POST] /auth/login
module.exports.loginPost = async (req, res) => {
    const record = await Account.findOne({
        email: req.body.email,
        deleted: false
    })
    if(!record){
        req.flash("error", "Email đăng nhập không tồn tại!");
        res.redirect("back");
        return;
    }
    if(md5(req.body.password) != record.password){
        req.flash("error", "Sai mật khẩu!");
        res.redirect("back");
        return;
    }
    await Account.updateOne({
        _id: record.id
    },{
        statusOnline: "online"
    })
    _io.once("connection", (socket) => {
        socket.broadcast.emit("SEVER_RETURN_STATUS_ONLINE", {
            userId: record.id,
            statusOnline: "online"
        });
    });
    res.cookie("token", record.token)
    res.redirect("/");
    req.flash("success", "Đăng nhập thành công"); 
}

//[GET] /auth/register
module.exports.register = (req, res) => {
    res.render("auth/register", {
        pageTile: "Đăng ký"
    })
}

//[POST] /auth/login
module.exports.registerPost = async (req, res) => {
    const account = req.body;
    account.password = md5(req.body.password);
    account.token = generateTokenHelper.generateToken(30);

    const record = new Account(account);
    await record.save(); 

    res.cookie("token", record.token)
    res.redirect("/");
    req.flash("success", "Đăng nhập thành công"); 
}

//[GET] /auth/logout
module.exports.logout = async (req, res) => {
    const token = req.cookies.token;
    await Account.updateOne({
        token: token
    },{
        statusOnline: "offline"
    })
    _io.once("connection", (socket) => {
        socket.broadcast.emit("SEVER_RETURN_STATUS_ONLINE", {
            userId: res.locals.user.id,
            statusOnline: "offline"
        });
    });
    req.flash("success", "Đăng xuất thành công!")
    res.clearCookie("token");
    res.redirect("/auth/login");
}