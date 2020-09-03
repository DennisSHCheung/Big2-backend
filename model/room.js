const logic = require("./logic");

class Room {
    constructor(code, socket) {
        this.code = code;
        this.socketsList = [];
        this.socketsList.push(socket);
        this.deck = [];
        logic.initDeck(this.deck);
        this.startIndex = 41;
        this.turnIndex = 0;
        this.inGame = false;
    }

    newGame() {
        this.inGame = true;
        this.startIndex = logic.shuffleDeck(this.deck, this.startIndex);
        let j = 0;
        let numOfCards = 13;
        if (this.socketsList.length === 2) numOfCards = 26;
        for (let i = 0; i < this.socketsList.length; i++) {
            this.socketsList[i].hand = this.deck.slice(j, j + numOfCards);
            j += numOfCards;
        }
        this.turnIndex = Math.floor(this.startIndex / numOfCards);
        console.log(this.startIndex);
        return this.turnIndex;
    }

    isInGame() {
        return this.inGame;
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
        this.inGame = false;
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