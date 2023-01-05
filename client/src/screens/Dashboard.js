import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import userContext from "../contexts/user/userContext";
import { handleGoogleLogout } from "../auth/auth";
import { useNavigate } from "react-router";

function Dashboard() {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.loggedIn) {
      return navigate("/");
    }
  }, [user.loggedIn]);
  return (
    <>
      <button onClick={(e) => !handleGoogleLogout(e, setUser)}>logout</button>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to={"/private-game"}>
          <button>Private Game</button>
        </Link>
        <Link>
          <button>Online Multiplayer</button>
        </Link>
      </div>
    </>
  );
}

export default Dashboard;
