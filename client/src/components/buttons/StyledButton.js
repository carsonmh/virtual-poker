import styled from "styled-components";

const StyledButton = styled.button`
  background: white;
  border-radius: 5px;
  padding: 10px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

export default StyledButton;
