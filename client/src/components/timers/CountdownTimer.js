import { useState, useEffect } from "react";

function CountdownTimer({ seconds }) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => {
        if (time === 0) {
          clearInterval(interval);
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div style={{ display: "inline" }}>{time}</div>;
}

export default CountdownTimer;
