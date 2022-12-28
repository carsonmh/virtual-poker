import styled from "styled-components";

const PlayerSlotDiv = styled.div`
  border-radius: 1000px;
  width: 125px;
  height: 30px;
  background: white;
  color: black;
  text-align: center;
  margin: 0px 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 5px 3px rgba(0, 0, 0, 0.2);
`;

const CardWrapper = styled.div`
  height: 65px;
  background: yellow;
  width: 80px;
`;

const InnerText = styled.p`
  font-size: 14px;
`;
function PlayerSlot({ user, chips }) {
  return (
    <>
      <CardWrapper />
      <PlayerSlotDiv>
        <InnerText>
          {user} / {chips}
        </InnerText>
      </PlayerSlotDiv>
    </>
  );
}

export default PlayerSlot;
