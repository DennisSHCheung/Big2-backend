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
    /* Called when a user first enters the site */
    io.on("create player", (name) => {
        io.emit("create player", controller.createPlayer(name));
    });
});

router.get('/', (req, res) => { res.status(200); });

server.listen(port, () => { console.log(`Listening on port: ${port}`); });
