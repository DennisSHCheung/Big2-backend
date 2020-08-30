const initDeck = (deck) => {
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 14; j++) {
          let card = { suit: i, number: j };
          deck.push(card);
        }
      }
}

const shuffleDeck = (deck) => {
    for (let i = 0; i < 52; i++) {
        let j = Math.floor((Math.random() * 52));
        let k = Math.floor((Math.random() * 52));
        let card = deck[j];
        deck[j] = deck[k];
        deck[k] = card;
      }
}

module.exports = {
    initDeck,
    shuffleDeck
}