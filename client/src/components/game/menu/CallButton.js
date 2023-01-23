import MenuButton from "./MenuButton";

function CallButton({ functional, p1Bet, p2Bet, callHandler }) {
  return (
    <MenuButton
      style={{
        background: "rgb(69, 91, 173)",
        opacity: functional ? "100%" : "75%",
      }}
      onClick={() => callHandler()}
    >
      {Math.abs(p1Bet - p2Bet) > 0 ? (
        <>
          Call
          <span
            style={{ color: "yellow", marginLeft: functional ? "7px" : "0" }}
          >
            {functional ? Math.abs(p1Bet - p2Bet) : ""}
          </span>
        </>
      ) : (
        <> Check </>
      )}
    </MenuButton>
  );
}

export default CallButton;
