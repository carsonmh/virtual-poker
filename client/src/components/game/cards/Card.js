import styled from "styled-components";
import ClubSvg from "../../../assets/suits/club-suit-svgrepo-com.svg";
import HeartSvg from "../../../assets/suits/heart-suit-svgrepo-com.svg";
import SpadeSvg from "../../../assets/suits/spade-suit-svgrepo-com.svg";
import DiamondSvg from "../../../assets/suits/diamond-suit-svgrepo-com.svg";

const StyledCard = styled.div`
  width: 45px;
  height: 70px;
  justify-content: space-around;
  border: solid 1px rgba(150, 150, 150, 0.5);
  border-radius: 5px;
  background: white;
`;

const CardNumber = styled.h1`
  font-size: 23px;
  font-weight: 800;
  margin: 0;
  position: relative;
  top: -5px;
  padding: 2px;
`;

const CardNumberWrapper = styled.div`
  width: 100%;
  height: 50%;
  text-align: left;
  padding: 0;
`;

const CardSuitWrapper = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: right;
`;

const SuitImage = styled.img`
  width: 75%;
  margin: 0;
  padding: 0;
  position: relative;
`;

function Card({ card }) {
  let number;
  let suit;
  let color;
  let suitImg;
  if (card) {
    if (card.length > 2) {
      number = card.substring(0, 2);
      suit = card.substring(2, 3);
    } else {
      number = card.substring(0, 1);
      suit = card.substring(1, 2);
    }
    switch (suit) {
      case "H":
        suitImg = HeartSvg;
        color = "rgb(174, 45, 54)";
        break;
      case "S":
        suitImg = SpadeSvg;
        color = "black";
        break;
      case "D":
        suitImg = DiamondSvg;
        color = "rgb(174, 45, 54)";
        break;
      case "C":
        suitImg = ClubSvg;
        color = "black";
        break;
      default:
        break;
    }
  }
  return (
    <StyledCard>
      <CardNumberWrapper>
        <CardNumber style={{ color: color }}>{number}</CardNumber>
      </CardNumberWrapper>
      <CardSuitWrapper>
        <SuitImage src={suitImg} />
      </CardSuitWrapper>
    </StyledCard>
  );
}

export default Card;
