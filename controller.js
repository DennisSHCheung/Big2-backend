const player = require("./model/player");

var playersList = [];

/* Create a new player and store it */
const createPlayer = (name) => {
    if (playersList.find(name) === undefined) {
        var newPlayer = new player.Player(name);
        playersList.push(newPlayer);
        return "Ok";
    } else {
        return "Failed";
    }
}

module.exports = {
    createPlayer
}