import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
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
function InputField({ value, setItem }) {
  return (
    <StyledInput
      placeholder={"Type your username"}
      onChange={setItem}
    ></StyledInput>
  );
}

export default InputField;
