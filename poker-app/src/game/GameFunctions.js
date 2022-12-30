import { Hand } from "pokersolver";

function determineWinner(p1Cards, p2Cards, mainDeck) {
  const p1Hand = Hand.solve([...p1Cards, ...mainDeck]);
  const p2Hand = Hand.solve([...p2Cards, ...mainDeck]);
  const winner = Hand.winners([p1Hand, p2Hand]);
  if (winner.length === 2) {
    return "tie";
  }
  if (winner[0] === p1Hand) {
    return "p1";
  }
  if (winner[0] === p2Hand) {
    return "p2";
  }
}

export { determineWinner };
