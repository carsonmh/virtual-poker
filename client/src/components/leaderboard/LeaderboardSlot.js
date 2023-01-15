import React, { useState } from "react";

import LeaderboardSlotWrapper from "./LeaderboardSlotWrapper";

function LeaderboardSlot({ username, points, index }) {
  return (
    <LeaderboardSlotWrapper
      style={{
        margin: "0px 10px 7px 10px",
      }}
      key={index}
    >
      <div
        style={{
          display: "flex",
          textAlign: "left",
          fontWeight: "bold",
        }}
      >
        <div style={{ width: "60px" }}>{index + 1}</div>
        <div
          style={{
            textOverflow: "ellipsis",
            maxWidth: "250px",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {username}
        </div>
      </div>
      <div>{Math.round(points)}</div>
    </LeaderboardSlotWrapper>
  );
}

export default LeaderboardSlot;
