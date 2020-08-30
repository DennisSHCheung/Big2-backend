const crypto = require("crypto");
const room = require("./model/room");

var roomsList = [];

/*  Attach variables to the socket object for the user upon initial connection   */
const initSocket = (socket) => {
    socket.name = "";
    socket.hand = [];
    socket.roomCode = "";
    console.log("New Client!");
}

/*  Remove the corresponding socket from the list upon disconnection   */
const deleteSocket = (socket) => {
    leaveRoom(socket);
    console.log(roomsList.length);
    console.log("Removed a client's socket");
}

/*  Room's code is randomly generated and it is checked to prevent duplicates. 
    Create a socket room provided by socket io  */
const createRoom = (socket, name) => {
    socket.name = name;
    let code = getUniqueCode(crypto.randomBytes(3).toString("Hex"));
    roomsList.push(new room.Room(code, socket));
    socket.roomCode = code;
    socket.join(code);  // Create a socket room based on the code

    let res = { status: "Ok", code: code };
    return res;
}

/*  Join room and the socket room if room code exists. 
    Also check input name against players' names in the room to avoid duplication.  */
const joinRoom = (socket, msg) => {
    let res = { status: "Failed", name: [] };
    if (socket.roomCode !== "") {
        res.name.push("Already in a room");
        return res;
    }

    let { name, code } = msg;
    let i = getRoomIndex(code);
    if (i === -1) {
        res.name.push("Does not exist");
        return res;  // Room code does not exist
    }  else if (roomsList[i].isFull()) {
        res.name.push("Full");
        return res;
    }

    name = getUniqueName(name, i);
    socket.name = name;
    roomsList[i].joinRoom(socket);
    socket.roomCode = code;
    socket.join(code);   // Join a socket room based on the code
    socket.to(code).emit("new player", name);   // Send a notification to players in the room

    res.status = "Ok";
    res.name = roomsList[i].getNames();
    return res;
}

/*  Leave room and socket room if room code exists.
    Remove the room from roomsList if there are no more active players in the room  */
const leaveRoom = (socket) => {
    if (socket.roomCode === "") return "Failed";

    let i = getRoomIndex(socket.roomCode);
    roomsList[i].leaveRoom(socket);
    socket.to(socket.roomCode).emit("player left", socket.name);
    socket.leave(socket.roomCode);
    socket.roomCode = "";

    if (roomsList[i].isEmpty()) { // No more active players in the room
        roomsList.splice(i, 1);
    }

    return "Ok";
}

/* --------------------- Helper functions ---------------------*/
const getUniqueName = (name, roomId) => {
    let names = roomsList[roomId].getNames();
    for (let i = 0; i < names.length; i++) {
        if (name === names[i]) {
            name += "1";
            getUniqueName(name, roomId);
        }
    }
    return name;
}

const getUniqueCode = (code) => {
    for (let j = 0; j < roomsList.length; j++) {
        if (roomsList[j].code === code) {
            code = crypto.randomBytes(3).toString("Hex");
            getUniqueCode(code);
        }
    }
    return code;
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
    initSocket,
    deleteSocket,
    createRoom,
    joinRoom,
    leaveRoom
}