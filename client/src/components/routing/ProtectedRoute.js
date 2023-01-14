import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkUserToken } from "../../auth/auth";
import userContext from "../../contexts/user/userContext";

function ProtectedRoute(props) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { user, setUser } = useContext(userContext);

  function checkUserAndNavigate() {
    checkUserToken().then((result) => {
      if (!result) {
        localStorage.clear();
        setUser((user) => ({ ...user, loggedIn: false }));
        setIsLoggedIn(false);
        return navigate("/");
      } else {
        setIsLoggedIn(true);
      }
    });
  }

  useEffect(() => {
    checkUserAndNavigate();
  }, [isLoggedIn]);
  return <>{isLoggedIn ? props.children : null}</>;
}
export default ProtectedRoute;
