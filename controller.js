const crypto = require("crypto");
const player = require("./model/player");
const room = require("./model/room");

var playersList = [];
var roomsList = [];

/*  Create a default player object for the user and store the socket upon initial connection   */
const storeSocket = (socket) => {
    var newPlayer = new player.Player(socket);
    playersList.push(newPlayer);
    console.log("New Client!");
}

/*  Remove the corresponding player object from the list upon disconnection   */
const deleteSocket = (socket) => {
    let i = getPlayerIndex(socket);
    playersList.splice(i, 1);
    console.log("Removed client's socket ", i);
}

/*  Room's code is randomly generated and it is checked to prevent duplicates. 
    Create a socket room provided by socket io  */
const createRoom = (socket, name) => {
    let i = getPlayerIndex(socket);
    playersList[i].setName(name);
    var code = crypto.randomBytes(3).toString("Hex");
    code = preventDuplicateCode(code);

    console.log("Code: ", code);
    var newRoom = new room.Room(code, playersList[i]);
    roomsList.push(newRoom);
    socket.join(code);  // Create a socket room based on the code
    let res = { status: "Ok", code: code };
    return res;
}

/*  Join room and the socket room if room code exists. 
    Also check input name against players' names in the room to avoid duplication.  */
const joinRoom = (socket, msg) => {
    let { name, code } = msg;
    let res = { status: "Failed", code: code, name: [] };

    let i = getRoomIndex(code);
    if (i === -1) {
        res.name[0] = "Does not exist";
        return res;  // Room code does not exist
    }  else if (roomsList[i].isFull()) {
        res.name[0] = "Full";
        return res;
    }

    name = preventDuplicateName(name, i);
    let j = getPlayerndex(socket);
    playersList[j].setName(name);
    roomsList[i].joinRoom(playersList[j]);
    socket.join(code);  // Joins a socket room based on the code
    res.status = "Ok";
    res.name = roomsList[i].getNames();
    return res;
}

/*  Leave room and socket room if room code exists.
    Remove the room from roomsList if there are no more active players in the room  */
const leaveRoom = (socket, msg) => {
    let { name, code } = msg;
    let i = getRoomIndex(code);
    if (i === -1) {
        return "Failed";
    }

    let j = getPlayerIndex(socket);
    roomsList[i].leaveRoom(playersList[j]);
    if (roomsList[i].getRoomSize() === 0) { // No more active players in the room
        roomsList.splice(i, 1);
    }
    socket.leave(code);
    return "Ok";
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
    joinRoom,
    leaveRoom
}