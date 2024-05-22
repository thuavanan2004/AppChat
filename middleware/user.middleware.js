const Account = require("../models/account.model");

module.exports.infoUser = async (req, res, next) => {
    if(req.cookies.token) {
      const user = await Account.findOne({
        token: req.cookies.token,
        deleted: false,
      });
  
      if(user) {
        res.locals.user = user;
      }
    }
    
    next();
  }