const crypto = require("crypto");
const player = require("./model/player");
const room = require("./model/room");

var playersList = [];
var roomsList = [];

/*  Create a default player for the user and store both the socket and the player upon initial connection   */
const storeSocket = (socket) => {
    var newPlayer = new player.Player(socket);
    playersList.push(newPlayer);
    console.log("New Client!");
}

/*  Remove the corresponding socket and player object from the list upon disconnection   */
const deleteSocket = (socket) => {
    let i = getPlayerIndex(socket);
    playersList.splice(i, 1);
    console.log("Removed client's socket ", i);
}

/*  Create a room based on the socket and set the associated player object's name to input name. 
    Create a random code for the room code and it is checked to prevent duplicates. 
    Create a socket room provided by socket io to emit messages only to players in the same room */
const createRoom = (socket, name) => {
    let i = getPlayerIndex(socket);
    playersList[i].setName(name);
    var code = crypto.randomBytes(3).toString("Hex");
    code = preventDuplicateCode(code);

    console.log("Code: ", code);
    var newRoom = new room.Room(code, playersList[i]);
    roomsList.push(newRoom);
    socket.join(code);  // Creates a socket room based on the code
    let res = { status: "Ok", code: code };
    return res;
}

/*  Join the room if room code exists. Also check duplicate names against players in the room. 
    Join the socket room created by the host */
const joinRoom = (socket, msg) => {
    let { name, code } = msg;
    let res = { status: "Failed", code: code, name: "" };

    let i = getRoomIndex(code);
    if (i === -1) {
        res.name = "Does not exist";
        return res;  // Room code does not exist
    }  else if (roomsList[i].isFull()) {
        res.name = "Full";
        return res;
    }

    name = preventDuplicateName(name, i);
    let j = getPlayerndex(socket);
    playersList[j].setName(name);
    roomsList[i].joinRoom(playersList[j]);
    socket.join(code);  // Joins a socket room based on the code
    res.status = "Ok";
    res.name = name;
    return res;
}

/* --------------------- Helper functions ---------------------*/
const preventDuplicateName = (name, roomId) => {
    let players = roomsList[roomId].getPlayers();
    for (let i = 0; i < players.length; i++) {
        if (name === players[i].getName()) {
            name += "1";
            preventDuplicateName(name, roomId);
        }
    }
    return name;
}

const preventDuplicateCode = (code) => {
    for (let j = 0; j < roomsList.length; j++) {
        if (roomsList[j].code === code) {
            code = crypto.randomBytes(3).toString("Hex");
            preventDuplicateCode(code);
        }
    }
    return code;
}

const getPlayerIndex = (socket) => {
    for (let i = 0; i < playersList.length; i++) {
        if (playersList[i].getSocket() === socket) {
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