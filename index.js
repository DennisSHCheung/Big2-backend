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
    socket.on("leave room", (msg) => controller.leaveRoom(socket));

    /*  Called when the user clicks the start game button */
    socket.on("start game", (msg) => controller.startGame(socket));

    /*  Called a player plays his hand  */
    socket.on("play turn", (cards) => controller.playTurn(socket, cards));
});

router.get('/', (req, res) => { return res.status(200); });

server.listen(port, () => { console.log(`Listening on port: ${port}`); });