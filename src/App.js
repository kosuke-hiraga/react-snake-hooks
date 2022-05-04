import { useState, useEffect, useCallback } from 'react'
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import ManipulationPanel from './components/ManipulationPanel';
import { initField, getFoodPosition } from './utils'

const initialPosition = { x: 17, y: 17 }
const initialValues = initField(35, initialPosition);

const isCollision = (fieldSize, position) => {
  // console.log(position);
  if (position.y < 0 || position.X < 0) {
    return true
  } else if ((position.y > fieldSize - 1 || position.x > fieldSize - 1)) {
    return true
  }

  return false
}

const isEatingMyself = (fileds, position) => {
  return fileds[position.y][position.x] === 'snake'
}

const Delta = Object.freeze({
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
});

const Direction = Object.freeze({
  up: 'up',
  right: 'right',
  left: 'left',
  down: 'down'
})

const OppositeDirection = Object.freeze({
  up: 'down',
  right: 'left',
  left: 'right',
  down: 'up'
})

const GameStatus = Object.freeze({
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gameover: 'gameover'
});

const DirectionKeyCodeMap = Object.freeze({
  37: Direction.left,
  38: Direction.up,
  39: Direction.right,
  40: Direction.down,
});



function App() {
  const defaultDifficulty = 3
  const Difficulty = [1000, 500, 100, 50, 10]


  const [fields, setFields] = useState(initialValues);
  // const [position, setPosition] = useState();
  // const [body, setBody] = useState([{ x: 17, y: 17 }]);
  const [body, setBody] = useState([]);
  const [tick, setTick] = useState(0);
  const [direction, setDirection] = useState(Direction.up);
  const [status, setStatus] = useState(GameStatus.init);
  const [difficulty, setDifficulty] = useState(defaultDifficulty);



  const defaultInterval = 200;

  let timer = undefined;

  const unsubscribe = () => {
    if (!timer) {
      return
    }
    clearInterval(timer);
  }

  const onStart = () => {
    console.log("onStart click");
    setStatus(GameStatus.playing);
  }

  const onStop = () => setStatus(GameStatus.suspended)

  const onRestart = () => {
    timer = setInterval(() => {
      setTick(tick => tick + 1)
    }, defaultInterval)
    setDirection(Direction.up)
    setStatus(GameStatus.init)
    // setPosition(initialPosition)
    setFields(initField(35, initialPosition))
  }


  const handleMoving = () => {
    // const { x, y } = position;
    console.log(body);
    const { x, y } = body[0];
    // console.log(direction);
    const delta = Delta[direction];
    const newPosition = {
      x: x + delta.x,
      y: y + delta.y,
    };
    if (isCollision(fields.length, newPosition) || isEatingMyself(fields, newPosition)) {
      return false;
    }
    // fields[y][x] = '';
    const newBody = [...body]
    if (fields[newPosition.y][newPosition.x] !== 'food') {
      const removingTrack = newBody.pop();
      fields[removingTrack.y][removingTrack.x] = '';
    } else {
      const food = getFoodPosition(fields.length, [...newBody, newPosition])
      fields[food.y][food.x] = 'food'
    }

    fields[newPosition.y][newPosition.x] = 'snake';
    // setBody([newPosition]);
    newBody.unshift(newPosition)
    setBody(newBody);
    setFields(fields);
    return true;
  };

  const onChangeDirection = useCallback((newDirection) => {
    // const onChangeDirection = (newDirection) => {
    console.log("ondirecton chage");
    if (status !== GameStatus.playing) {
      return direction
    }

    if (OppositeDirection[direction] === newDirection) {
      return
    }
    setDirection(newDirection)
  }, [direction, status]);


  const handleKeyDown = (e) => {
    const newDirection = DirectionKeyCodeMap[e.keyCode];
    if (!newDirection) {
      return;
    }

    onChangeDirection(newDirection);
  };


  const onChangeDifficulty = useCallback((difficulty) => {
    if (status !== GameStatus.init) {
      return
    }
    if (difficulty < 1 || difficulty > Difficulty.length) {
      return
    }
    setDifficulty(difficulty)
  }, [status, difficulty])



  useEffect(() => {
    const interval = Difficulty[difficulty - 1]
    setBody([initialPosition]);

    // setInterval(() => console.log("1000m..."), 10000);

    // ゲームの中の時間を管理する
    timer = setInterval(() => {
      setTick(tick => tick + 1);
      // }, defaultInterval)
    }, interval)
    return unsubscribe
  }, [difficulty])

  useEffect(() => {
    // if (!position || status !== GameStatus.playing) {
    if (body.length === 0 || status !== GameStatus.playing) {
      console.log(" no reload");
      return
    }
    const canContinue = handleMoving();
    if (!canContinue) {
      console.log("GAME OVER");
      setStatus(GameStatus.gameover)
    }
  }, [tick])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodeMap[e.keyCode];
      if (!newDirection) {
        return;
      }

      onChangeDirection(newDirection);
    };
    document.addEventListener('keydown', handleKeyDown, { once: true });
    // return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onChangeDirection])

  document.addEventListener('keydown', handleKeyDown);


  return (
    <div className="App">
      <header className="header">
        <div className="title-container">
          <h1 className="title">Snake Game</h1>
        </div>
        {/* <Navigation /> */}
        <Navigation length={body.length} difficulty={difficulty} onChangeDifficulty={onChangeDifficulty} />
      </header>
      <main className="main">
        <Field field={fields} />
      </main>
      <footer className="footer">
        {/* <Button onStart={() => setStatus(GameStatus.playing)} /> */}
        {/* <Button status={status} onStart={onStart} onRestart={onRestart} /> */}
        <Button status={status} onStop={onStop} onStart={onStart} onRestart={onRestart} />
        {/* <ManipulationPanel /> */}
        <ManipulationPanel onChange={onChangeDirection} />
      </footer>
    </div>
  );
}

export default App;
