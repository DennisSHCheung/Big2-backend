const logic = require("./logic");

class Room {
    constructor(code, socket) {
        this.code = code;
        this.socketsList = [];
        this.socketsList.push(socket);
        this.deck = [];
        logic.initDeck(this.deck);
    }

    newGame() {
        logic.shuffleDeck(deck);
    }

    getCode() {
        return this.code;
    }

    isEmpty() {
        return this.socketsList.length === 0;
    }

    getSockets() {
        return this.socketsList;
    }

    getNames() {
        var names = [];
        for (let i = 0; i < this.socketsList.length; i++) {
            names.push(this.socketsList[i].name);
        }
        return names;
    }

    isFull() {
        return this.socketsList.length === 4;
    }

    joinRoom(socket) {
        this.socketsList.push(socket);
    }

    leaveRoom(socket) {
        for (let i = 0; i < this.socketsList.length; i++) {
            if (this.socketsList[i].id === socket.id) {
                this.socketsList.splice(i, 1);
                return;
            }
        }
    }
}

module.exports = {
    Room
}