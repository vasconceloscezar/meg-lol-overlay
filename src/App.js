import logo from "./logo.svg";
import "./App.css";
import GameStats from "./GameStats";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>NAMASTEX Labs</p>
      </header>
      <GameStats />
    </div>
  );
}

export default App;
