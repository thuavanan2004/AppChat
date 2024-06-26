const authRoute = require("./auth.route");
const chatRoute = require("./chat.route");
const userRoute = require("./user.route");
const usersRoute = require("./users.route");


const requireAuthMiddleware = require("../middleware/requireAuth.middleware");
const chatMiddleware = require("../middleware/chat.middleware");

const userMiddleware = require("../middleware/user.middleware");

module.exports = (app) => {
    app.use(userMiddleware.infoUser);

    app.use("/auth", authRoute);

    app.use("/", requireAuthMiddleware.requireAuth, chatMiddleware.chatAll,  chatRoute);

    app.use("/user", requireAuthMiddleware.requireAuth, chatMiddleware.chatAll, userRoute);

    app.use("/users", requireAuthMiddleware.requireAuth, chatMiddleware.chatAll, usersRoute); 
}  