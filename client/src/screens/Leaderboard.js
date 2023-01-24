import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import LeaderboardSlot from "../components/leaderboard/LeaderboardSlot";
import Loading from "../components/loading/Loading";
import LeftArrow from "../assets/icons8-left-arrow-100.png";
import StyledButton from "../components/buttons/StyledButton";
import LeaderboardSlotWrapper from "../components/leaderboard/LeaderboardSlotWrapper";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://lunar-marker-335505.uw.r.appspot.com/api/get-users")
      .then((result) => {
        let usersArray = Object.values(result.data);
        usersArray.sort((a, b) => b.points - a.points);
        setUsers(usersArray);
      });
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      setIsLoading(false);
    }
  }, [users]);

  if (isLoading) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <>
      <StyledButton
        style={{
          position: "relative",
          left: "2%",
          top: "2%",
          width: "75px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        <img style={{ width: "50%" }} src={LeftArrow} />
      </StyledButton>
      <h1
        style={{
          textAlign: "center",
          fontSize: "35px",
          margin: 0,
          paddingBottom: "20px",
          fontWeight: "bold",
          marginTop: "30px",
        }}
      >
        Leaderboard
      </h1>
      <LeaderboardSlotWrapper
        style={{
          margin: "10px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "150px",
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          <div>Rank</div>
          <div
            style={{
              textOverflow: "ellipsis",
              maxWidth: "100px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              marginLeft: "20px",
            }}
          >
            Username
          </div>
        </div>
        <div style={{ fontWeight: "bold" }}>Points</div>
      </LeaderboardSlotWrapper>
      <ul style={{ overflowY: "auto", overflowX: "hidden", height: "490px" }}>
        {users.map((user, index) => {
          return (
            <LeaderboardSlot
              username={user.username}
              points={user.points}
              index={index}
            />
          );
        })}
      </ul>
    </>
  );
}

export default Leaderboard;
