import {
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
} from "@chakra-ui/react";
import styled from "styled-components";

const SliderWrapper = styled.div`
  width: 100px;
  margin: 0 20px 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function RaiseSlider({
  p1Bet,
  p2Bet,
  p1Chips,
  p2Chips,
  raiseAmount,
  setRaiseAmount,
  SB,
}) {
  return (
    <SliderWrapper>
      <Slider
        onChange={(v) => {
          setRaiseAmount(v);
        }}
        // defaultValue={10 + Math.max(p1Bet, p2Bet)}
        min={10 + Math.max(p1Bet, p2Bet)}
        max={Math.min(p1Chips + p1Bet, p2Chips + p2Bet)}
        step={SB}
        value={raiseAmount}
      >
        <SliderTrack bg="red.100">
          <Box position="relative" right={10} />
          <SliderFilledTrack bg="#85BF99" />
        </SliderTrack>
        <SliderThumb boxSize={6} />
      </Slider>
    </SliderWrapper>
  );
}

export default RaiseSlider;
