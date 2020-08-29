const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.port || 8001;
const router = express.Router();

var app = express();
app.use(cors());

var server = http.createServer(app);
var io = socketIo(server);

io.on("connect", (socket) => {

});

router.get('/', (req, res) => { res.status(200); });


server.listen(port, () => { console.log(`Listening on port: ${port}`); });
