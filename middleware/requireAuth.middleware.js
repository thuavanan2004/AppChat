const Account = require("../models/account.model");

module.exports.requireAuth = async (req, res, next) => {
    
    if(!req.cookies.token) {
        res.redirect(`/auth/login`);
        return;
    }
    const user = await Account.findOne({
        token: req.cookies.token,
        deleted: false,
    });

    if(!user){
        res.clearCookie("token");
        res.redirect(`/auth/login`);
        return;
    }
    
    next();
}