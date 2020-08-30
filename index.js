const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const controller = require("./controller");

const port = process.env.port || 8001;
const router = express.Router();

var app = express();
var server = http.createServer(app);
var io = socketIo(server);

io.on("connect", (socket) => {
    /*  Called when a user first enters the site    */
    controller.initSocket(socket);

    /*  Called when the user exits the site  */
    socket.on("disconnect", (reason) => {
        controller.deleteSocket(socket);
    })

    /*  Called when the user creates a room */
    socket.on("create room", (name) => {
        socket.emit("create room", controller.createRoom(socket, name));
    });

    /*  Called when the user attempts to join a room  */
    socket.on("join room", (msg) => {
        socket.emit("join room", controller.joinRoom(socket, msg));
    });

    /*  Called when the user attempts to leave a room   */
    socket.on("leave room", (msg) => {
        socket.emit("leave room", controller.leaveRoom(socket));
    });
});

router.get('/', (req, res) => { return res.status(200); });

server.listen(port, () => { console.log(`Listening on port: ${port}`); });