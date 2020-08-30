const logic = require("./logic");

class Room {
    constructor(code, socket) {
        this.code = code;
        this.socketsList = [];
        this.socketsList.push(socket);
        this.deck = [];
        logic.initDeck(this.deck);
    }

    getCode() {
        return this.code;
    }

    isEmpty() {
        return this.socketsList.length === 0;
    }

    getNames() {
        var names = [];
        for (let i = 0; i < this.socketsList.length; i++) {
            names.push(this.playersList[i].name);
        }
        return names;
    }

    isFull() {
        return this.socketsList.length === 4;
    }

    joinRoom(socket) {
        this.socketsList.push(socket);
    }

    // leaveRoom(player) {
    //     for (let i = 0; i < this.playersList.length; i++) {
    //         if (player.getName() === this.playersList[i].getName()) {
    //             this.playersList.splice(i, 1);
    //             return "Ok";
    //         }
    //     }
    //     return "Failed";
    // }
}

module.exports = {
    Room
}