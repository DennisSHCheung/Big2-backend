class Player {
    constructor(name) {
        this.username = name;
        this.hand = [];
    }

    getName() {
        return this.username;
    }
}

module.exports = {
    Player
}
