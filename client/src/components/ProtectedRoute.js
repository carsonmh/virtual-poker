import React, { useEffect, useState } from "react";
import { Route, useNavigate } from "react-router-dom";
import { checkUserToken } from "../auth/auth";
import axios from "axios";
function ProtectedRoute(props) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function checkUserAndNavigate() {
    if (!checkUserToken()) {
      setIsLoggedIn(false);
      return navigate("/");
    } else {
      setIsLoggedIn(true);
    }
  }

  useEffect(() => {
    checkUserAndNavigate();
  }, [isLoggedIn]);
  return <React.Fragment>{isLoggedIn ? props.children : null}</React.Fragment>;
}
export default ProtectedRoute;
