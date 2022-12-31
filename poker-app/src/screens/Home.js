import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Link to={"/private-game"}>
        <button>Private Game</button>
      </Link>
      <Link>
        <button>Online Multiplayer</button>
      </Link>
    </div>
  );
}

export default Home;
