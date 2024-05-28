const express = require("express");
const bodyParser = require('body-parser')
const dotenv = require("dotenv");
dotenv.config();
const routeClient = require("./routes/index.route");
const database = require("./config/database");
const methodOverride = require('method-override');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");



const app = express();

//Cấu hình biến môi trường
const port = process.env.PORT;

//Middleware để phân tích dữ liệu của yêu cầu HTTP.
app.use(bodyParser.urlencoded({ extended: false }))

//Set đường dẫn cho pug
app.set("view engine", "pug")
app.set('views', `${__dirname}/views`);

//Thiết lập thư mục tĩnh public
app.use(express.static(`${__dirname}/public`))

//Thiết lập phương thức HTTP
app.use(methodOverride('_method'));

//Flash
app.use(cookieParser('JHSVBDSDSD'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());



// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

// End SocketIO

//Kết nối database
database.connect();

//Thiết lập routes 
routeClient(app)


//Khởi động máy chủ
server.listen(port, () => {
    console.log(`App đang lắng nghe cổng ${port}`);
})