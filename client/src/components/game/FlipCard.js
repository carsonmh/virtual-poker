import { useEffect, useState } from "react";
import styled from "styled-components";

import BlankCard from "./BlankCard";
import Card from "./Card";

const FlipCardWrapper = styled.div`
  background-color: transparent;
  perspective: 1000px;
  width: 45px;
  height: 75px;
`;

const FlipCardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: ${({ rotated }) => (rotated ? "rotateY(180deg)" : "none")};
`;

const FrontCard = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotateY(180deg);
  backface-visibility: hidden;
`;

const BackCard = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
`;

function FlipCard({ value }) {
  const [rotated, setRotated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRotated(true);
    }, [500]);
  }, []);

  return (
    <FlipCardWrapper>
      <FlipCardInner rotated={rotated}>
        <FrontCard>
          <Card card={value} />
        </FrontCard>
        <BackCard>
          <BlankCard>HU</BlankCard>
        </BackCard>
      </FlipCardInner>
    </FlipCardWrapper>
  );
}

export default FlipCard;
