import styled from "styled-components";

const MenuButton = styled.button`
  background: rgba(85, 160, 110, 0.6);
  padding: 2px;
  color: white;
  width: 100px;
  height: 25px;
  margin: 10px;
  border-radius: 100px;
  font-weight: 550;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: inset 0 0 0 10em rgba(255, 255, 255, 0.1);
  }
  &:active {
    box-shadow: inset 0 0 0 10em rgba(255, 255, 255, 0.2);
  }
`;

export default MenuButton;
