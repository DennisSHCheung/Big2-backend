class Room {
    constructor(code, player) {
        this.code = code;
        this.playersList = [];
        this.playersList.push(player);
    }

    getCode() {
        return this.code;
    }

    getRoomSize() {
        return this.playersList.length;
    }

    getPlayers() {
        return this.playersList;
    }

    isFull() {
        return this.playersList.length === 4;
    }

    joinRoom(player) {
        if (isFull()) return "Failed";
        this.playersList.push(player);
        return "Ok";
    }

    leaveRoom(player) {
        for (let i = 0; i < 4; i++) {
            if (player.getName() === this.playersList[i].getName()) {
                this.playersList.splice(i, 1);
                return "Ok";
            }
        }
        return "Failed";
    }
}

module.exports = {
    Room
}