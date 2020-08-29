const crypto = require("crypto");
const player = require("./model/player");
const room = require("./model/room");

var playersList = [];
var socketsList = [];
var roomsList = [];

/*  Create a default player for the user and store both the socket and the player upon initial connection   */
const storeSocket = (socket) => {
    var newPlayer = new player.Player();
    socketsList.push(socket);
    playersList.push(newPlayer);
    console.log("New Client!\n");
}

/*  Remove the corresponding socket and player object from the list upon disconnection   */
const deleteSocket = (socket) => {
    let i = getSocketIndex(socket);
    socketsList.splice(i, 1);
    playersList.splice(i, 1);
    console.log("Removed client's socket\n");
}

/*  Create a room based on the socket and set the associated player object's name to input name. 
    Create a random code for the room code and it is checked to prevent duplicates. 
    Create a socket room provided by socket io to emit messages only to players in the same room */
const createRoom = (socket, name) => {
    let i = getSocketIndex(socket);
    playersList[i].setName(name);
    var code = crypto.randomBytes(5).toString("Hex");
    for (let j = 0; j < roomsList.length; j++) {
        if (roomsList[j].code === code) {
            code = crypto.randomBytes(1).toString("Dec");
        }
    }
    console.log("Code: ", code);
    var newRoom = new room.Room(code, playersList[i]);
    roomsList.push(newRoom);
    socket.join(code);  // Creates a socket room based on the code
    return "Ok";
}

/*  Join the room if room code exists. Also check duplicate names against players in the room. 
    Join the socket room created by the host */
const joinRoom = (socket, msg) => {
    let { name, code } = msg;
    let i = getRoomIndex(code);
    if (i === -1) return "Failed";  // Room code does not exist
    let j = getSocketIndex(socket);
    name = preventDuplicateName(name, i);

    if (roomsList[i].isFull()) return "Failed";
    roomsList[i].joinRoom(playersList[j]);
    socket.join(code);  // Joins a socket room based on the code
    socket.to(code).emit("new player", "A new player joined!"); // A notification message to other players in the same room
    return "Ok";
}

/* --------------------- Helper functions ---------------------*/
const preventDuplicateName = (name, roomId) => {
    let players = roomsList[roomId].getPlayers();
    for (let i = 0; i < players.length; i++) {
        if (name === players[i].getName()) {
            name += "1";
            setName(name, roomId);
        }
    }
    return name;
}


const getSocketIndex = (socket) => {
    for (let i = 0; i < socketsList.length; i++) {
        if (socketsList[i] === socket) {
            return i;
        }
    }
    return -1;
}

const getRoomIndex = (code) => {
    for (let i = 0; i < roomsList.length; i++) {
        if (code === roomsList[i].getCode()) {
            return i;
        }
    }
    return -1;
}

module.exports = {
    storeSocket,
    deleteSocket,
    createRoom,
    joinRoom
}