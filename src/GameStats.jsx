import React, { useState, useEffect } from "react";

const GameStats = (props) => {
  // State structure
  const [nextDragon, setNextDragon] = useState({});
  const [nextBaron, setNextBaron] = useState({});
  const [gameTime, setGameTime] = useState(0);
  const [gamePaused, setGamePaused] = useState(false);
  const [inhibitors, setInhibitors] = useState([]);
  const [scoreboard, setScoreboard] = useState({});
  const [blueGold, setBlueGold] = useState(0);
  const [redGold, setRedGold] = useState(0);
  const [blueColor, setBlueColor] = useState("");
  const [redColor, setRedColor] = useState("");
  // State to hold the game stats data

  useEffect(() => {
    const variables = {
      useSSL: false, // Example value. You can fetch this from some configuration
      backendUrl: "localhost", // Example value
      backendPort: 9001, // Example value
      backendWsLoc: "api", // Example endpoint. You can customize this
    };

    const ws = new WebSocket(
      `${variables.useSSL ? "wss" : "ws"}://${variables.backendUrl}:${
        variables.backendPort
      }/${variables.backendWsLoc}`
    );

    // Request Overlay Config after establishing the connection
    ws.onopen = () => {
      ws.send('{"requestType": "OverlayConfig", "OverlayType": "Ingame"}');
    };

    // Handle messages from the server

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.eventType && data.eventType === "GameHeartbeat") {
        setNextDragon(data.nextDragon || {});
        setNextBaron(data.nextBaron || {});
        setGameTime(data.gameTime || 0);
        setGamePaused(data.gamePaused || false);
        setInhibitors(data.inhibitors?.Inhibitors || []);
        setScoreboard(data.scoreboard || {});
        setBlueGold(data.blueGold || 0);
        setRedGold(data.redGold || 0);
        setBlueColor(data.blueColor || "");
        setRedColor(data.redColor || "");
      }
      console.log(data);
    };

    // Handle connection closure and errors
    ws.onclose = () => {
      console.log("Connection closed. Trying to reconnect...");
      setTimeout(() => {
        // Reconnection logic. For now, just log the action.
        console.log("Reconnecting...");
      }, 500);
    };

    ws.onerror = () => {
      console.log("[LB] Connection error!");
    };

    // Cleanup the WebSocket connection when the component is unmounted
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h2>Game Stats</h2>
      <div>
        <h3>Game Time</h3>
        <p>{gameTime}</p>
      </div>
      <div>
        <h3>Game Paused</h3>
        <p>{gamePaused ? "True" : "False"}</p>
      </div>
      <div>
        <h3>Next Dragon</h3>
        <p>Type: {nextDragon?.Element || "Unknown"}</p>
        <p>Spawn in: {nextDragon?.SpawnTimer || "Unknown"} seconds</p>
      </div>
      <div>
        <h3>Next Baron</h3>
        <p>Spawn in: {nextBaron.SpawnTimer} seconds</p>
      </div>
    </div>
  );
};

export default GameStats;
