function Deck() {}

function makeDeck() {
  const deck = [];
  const suits = ["H", "D", "C", "S"];
  for (const i in suits) {
    for (let j = 2; j < 11; j++) {
      deck.push(j + suits[i]);
    }
    deck.push("J" + suits[i]);
    deck.push("Q" + suits[i]);
    deck.push("K" + suits[i]);
    deck.push("A" + suits[i]);
  }
  shuffleArray(deck);
  return deck;
}

function shuffleArray(array) {
  for (let i = array.length; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export default Deck;
export { makeDeck };
