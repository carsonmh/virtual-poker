import styled from "styled-components";

const StyledButton = styled.button`
  background: white;
  border-radius: 5px;
  padding: 10px;
  width: 200px;

  &:hover {
    background: rgba(255, 255, 255, 0.8);
  }

  &:active {
    background: rgba(255, 255, 255, 0.5);
  }
`;

export default StyledButton;
