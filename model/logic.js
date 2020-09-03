const initDeck = (deck) => {
	for (let i = 0; i < 4; i++) {
		let suit = "S";
		if (i === 1) suit = "H";
		else if (i === 2) suit = "C";
		else if (i === 3) suit = "D";
        for (let j = 1; j < 14; j++) {
			let number = j.toString();
			if (number == 1) number = "A";
			else if (number == 11) number = "J";
			else if (number == 12) number = "Q";
			else if (number == 13) number = "K";
        	let card = { suit: suit, number: number };
        	deck.push(card);
        }
      }
}

const shuffleDeck = (deck, startIndex) => {
    for (let i = 0; i < 52; i++) {
        let j = Math.floor((Math.random() * 52));
        let k = Math.floor((Math.random() * 52));
        if (j === startIndex) startIndex = k;
        else if (k === startIndex) startIndex = j;
        let card = deck[j];
        deck[j] = deck[k];
        deck[k] = card;
	}
	return startIndex;
}

module.exports = {
    initDeck,
    shuffleDeck
}