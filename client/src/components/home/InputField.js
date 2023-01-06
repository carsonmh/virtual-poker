import styled from "styled-components";

const InputField = styled.input`
  width: 250px;
  margin: 20px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
  padding: 4px;

  &:focus {
    outline: none;
  }
`;

export default InputField;
