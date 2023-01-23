import React from "react";
import styled from "styled-components";

const PotDiv = styled.div`
  height: 20px;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  border-radius: 100px;
  padding: 10px;
`;

function Pot({ pot }) {
  return (
    <PotDiv>
      <div>
        Total Pot: <strong>{pot}</strong>
      </div>
    </PotDiv>
  );
}

export default Pot;
