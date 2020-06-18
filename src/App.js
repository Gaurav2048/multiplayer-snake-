import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import Snake from './components/Snake';
import './App.css';

const ENDPOINT = 'http://127.0.0.1:4001';

function App() {
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const userId = Math.floor(Math.random(0, 100) * 100);
  var socket;

  const onScoreIncrease = () => {
    setScore(score + 1);
    if (score >= 5) {
      const factor = Math.floor(score / 5 + 1);
      setSpeed(1000 / factor);
    }
  };

  useEffect(() => {
    socket = socketIOClient(ENDPOINT);
    socket.on('move', (data) => {
      // setResponse(data);
      console.log(data);
    });
  }, []);

  const keyStroke = (keycode) => {
    console.log(keycode);
    socket.emit(
      'move',
      JSON.stringify({
        userId,
        keycode,
      })
    );
  };

  return (
    <div className="App">
      <h1>Score {score}</h1>
      <div className="play_ground">
        <Snake
          score={() => onScoreIncrease()}
          speed={speed}
          keyCode={keyStroke}
        />
      </div>
      <h3 style={{ marginTop: '85vh' }}>Press Space to start.</h3>
    </div>
  );
}

export default App;
