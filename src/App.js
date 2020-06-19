import React, { useState, useEffect, useMemo } from 'react';
import { socket } from './components/Socket';
import Snake from './components/Snake';
import Prey from './components/Prey';
import './App.css';

function App() {
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [preyPosition, setPreyPosition] = useState({});
  const [startedPlayer, setStartedPlayer] = useState('');
  const [movement, setMovement] = useState({ direction: -1, id: '' });
  const [scorer, setScorer] = useState('');
  const [players, setPlayers] = useState({});
  const onScoreIncrease = () => {
    setScore(score + 1);
    if (score >= 5) {
      const factor = Math.floor(score / 5 + 1);
      setSpeed(1000 / factor);
    }
  };

  const checkPlayers = () => {
    console.log(players);
  };

  useEffect(() => {
    console.log(socket);

    socket.on('direction', (data) => {
      // setResponse(data);
      data = JSON.parse(data);
      setMovement({
        direction: data.direction,
        snakeId: data.id,
      });
      console.log('direction', data);
    });

    socket.on('scorer', (snakeId) => {
      console.log('scorer', snakeId);
      snakeId = JSON.parse(snakeId).snakeId;
      setScorer(snakeId);
    });

    socket.on('start', (obj) => {
      console.log('start', obj);
      obj = JSON.parse(obj);
      console.log(obj);

      const snakeId = obj.id;
      setStartedPlayer(snakeId);
    });

    socket.on('new_pray', (position) => {
      position = JSON.parse(position);
      setPreyPosition(position);
    });

    socket.on('player', (data) => {
      data = JSON.parse(data);
      console.log('nghhj', typeof data.players);

      setPlayers((prevState) => data.players);
      console.log('gcvjh', players);

      console.log(data);
      if (data.preyPosition !== undefined) {
        setPreyPosition({ ...data.preyPosition });
      }
    });
  }, []);

  useEffect(() => {
    const startedPlayerObj = players[startedPlayer];
    setPlayers((prevState) => ({
      ...prevState,
      [startedPlayer]: {
        ...startedPlayerObj,
        hasStarted: true,
      },
    }));
    console.log('started player', players);
  }, [startedPlayer]);

  useEffect(() => {
    console.log('player data', players);
  }, [players]);

  useEffect(() => {
    const startedPlayerObj = players[movement.snakeId];
    setPlayers((prevState) => ({
      ...prevState,
      [movement.snakeId]: {
        ...startedPlayerObj,
        direction: movement.direction,
        isDirectionChanged: true,
      },
    }));
  }, [movement]);

  useEffect(() => {
    console.log('scorer update.');

    if (scorer !== '') {
      const scoredPlayer = players[scorer];
      setPlayers((prevState) => ({
        ...prevState,
        [scorer]: {
          ...scoredPlayer,
          score: scoredPlayer.score + 1,
        },
      }));
      setScorer('');
    }
  }, [scorer]);

  const onHunt = (obj) => {
    socket.emit('pray_caught', JSON.stringify(obj));
  };

  const keyStroke = (obj) => {
    socket.emit(
      obj.type,
      JSON.stringify({
        id: obj.snakeId,
        direction: obj.keyCode,
      })
    );
  };

  const resetDirectionChange = (snakeId) => {
    const resetPlayer = players[snakeId];

    setPlayers((prevState) => ({
      ...prevState,
      [snakeId]: {
        ...resetPlayer,
        isDirectionChanged: false,
      },
    }));
  };

  const renderSnakes = useMemo(() => {
    console.log('final update');

    return Object.entries(players).map(([key, val]) => (
      <Snake
        key={key}
        snakeId={key}
        score={val.score}
        speed={val.speed}
        hasStarted={val.hasStarted}
        color={val.color}
        keyCode={keyStroke}
        direction={val.direction}
        isDirectionChanged={val.isDirectionChanged}
        listenToNativeEvents={val.self}
        onHunt={onHunt}
        resetDirectionChange={resetDirectionChange}
        preyTop={preyPosition.preyTop}
        preyLeft={preyPosition.preyLeft}
      />
    ));
  }, [players, preyPosition]);

  return (
    <div className="App">
      <h1>Score {score}</h1>
      <div className="play_ground">
        <Prey left={preyPosition.preyLeft} top={preyPosition.preyTop} />
        {renderSnakes}
      </div>
      <h3 style={{ marginTop: '85vh' }}>Press Space to start.</h3>
      <button onClick={checkPlayers}>check</button>
    </div>
  );
}

export default App;
