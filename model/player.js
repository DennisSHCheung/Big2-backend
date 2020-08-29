class Player {
    constructor() {
        this.username = "";
        this.hand = [];
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
