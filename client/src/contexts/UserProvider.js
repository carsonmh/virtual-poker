import React, { useState } from "react";

import userContext from "./userContext";

function UserProvider({ children }) {
  const [user, setUser] = useState({});
  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
}

export default UserProvider;
