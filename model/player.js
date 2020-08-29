class Player {
    constructor(socket) {
        this.username = "";
        this.socket = socket;
        this.hand = [];
    }

    getSocket() {
        return this.socket;
    }

    getName() {
        return this.username;
    }

    setName(name) {
        this.username = name;
    }
}

module.exports = {
    Player
}
