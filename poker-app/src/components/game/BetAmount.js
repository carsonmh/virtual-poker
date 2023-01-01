import styled from "styled-components";
import ChipIcon from "../../assets/icons8-chip-16.png";

const BetAmountDiv = styled.div`
  width: 75px;
  height: 20px;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 100px;
  position: relative;
`;

function BetAmount({ betAmount, top }) {
  return (
    <BetAmountDiv style={{ top: top }}>
      <img src={ChipIcon} />
      {betAmount}
    </BetAmountDiv>
  );
}

export default BetAmount;
