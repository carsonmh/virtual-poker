import React, { useContext } from "react";
import styled from "styled-components";
import { handleGoogleSignIn } from "../../auth/auth";
import userContext from "../../contexts/user/userContext";
import GoogleLogo from "../../assets/icons8-google.svg";

const GoogleButtonWrapper = styled.div``;

const GoogleButton = styled.button`
  width: 250px;
  height: 50px;
  background: white;
  border-radius: 30px;
  display: flex;
  align-items: center;
  background: white;
  box-shadow: 0px 1px 5px 3px rgba(0, 0, 0, 0.3);
`;

function LogInWithGoogleButton({ setLoggedInWithGoogle }) {
  const { user, setUser } = useContext(userContext);
  return (
    <GoogleButtonWrapper>
      <GoogleButton
        onClick={() => {
          const signedIn = handleGoogleSignIn(setUser, setLoggedInWithGoogle);
        }}
      >
        <div>
          <img style={{ marginLeft: "5px" }} width={"60%"} src={GoogleLogo} />
        </div>{" "}
        <div style={{ fontSize: "20px" }}>Sign in with Google</div>
      </GoogleButton>
    </GoogleButtonWrapper>
  );
}

export default LogInWithGoogleButton;
