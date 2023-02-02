import { Hand } from "pokersolver";

function generateRoomCode() {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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

function getUserFromPlayerString(winnerPlayer, users) {
  if (winnerPlayer === "tie") {
    return "tie";
  }
  let winnerNumber;
  if (winnerPlayer === "p1") {
    winnerNumber = 0;
  } else if (winnerPlayer === "p2") {
    winnerNumber = 1;
  }
  const winnerUser = users.filter(
    (user) => user.playerNumber === winnerNumber
  )[0];
  return winnerUser;
}

function computeEloChange(elo1, elo2, winner) {
  const E1 = 1 / (1 + Math.pow(10, (elo2 - elo1) / 400));
  const A1 = winner === true ? 1 : 0;
  const new1 = elo1 + 32 * (A1 - E1);
  return new1;
}

function getOpponent(users, user) {
  const playerNumber = user.playerNumber;
  return users.filter((user) => user.playerNumber !== playerNumber)[0];
}

function getIsWinner(playerNumber, winner) {
  return (
    (playerNumber === 0 && winner === "p1") ||
    (playerNumber === 1 && winner === "p2")
  );
}

export {
  generateRoomCode,
  determineWinner,
  getUserFromPlayerString,
  computeEloChange,
  getOpponent,
  getIsWinner,
};
