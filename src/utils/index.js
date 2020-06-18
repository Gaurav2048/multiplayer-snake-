const copyObj = (obj) => {
  const newObj = {};
  for (const key of Object.keys(obj)) {
    newObj[key] = obj[key];
  }
  return newObj;
};

const isComplimentaryDirection = (sqr1, sqr2) => {
  if (sqr1.direction === 38 && sqr2.direction === 40) return true;
  if (sqr1.direction === 37 && sqr2.direction === 39) return true;
  if (sqr2.direction === 38 && sqr1.direction === 40) return true;
  if (sqr2.direction === 37 && sqr1.direction === 39) return true;
  return false;
};

const positionPrey = () => {
  const preyLeft = Math.floor(Math.random() * 78);
  const preyTop = Math.floor(Math.random() * 78);
  console.log(preyLeft, preyTop);

  return { preyLeft, preyTop };
};

const isPreyHunted = (preyPosition, snakePosition) => {
  const leftRange = [preyPosition.left, preyPosition.left + 2];
  const topRange = [preyPosition.top, preyPosition.top + 2];
  if (
    leftRange[0] <= snakePosition.left &&
    snakePosition.left <= leftRange[1] &&
    topRange[0] <= snakePosition.top &&
    snakePosition.top <= topRange[1]
  ) {
    return true;
  } else return false;
};

const isGameOver = (snake) => {
  let firstSquare = snake[0];
  let isGameOver = false;
  if (
    firstSquare.top < 0 ||
    firstSquare.left > 78 ||
    firstSquare.top > 78 ||
    firstSquare.left < 0
  )
    isGameOver = true;

  for (let i = 0; i < snake.length; i++) {
    const square = snake[i];
    for (let j = i + 1; j < snake.length; j++) {
      const nextSquare = snake[j];
      if (square.top === nextSquare.top && square.left === nextSquare.left) {
        if (!isComplimentaryDirection(square, nextSquare)) {
          console.log(square, nextSquare);
          isGameOver = true;
          break;
        }
      }
    }
  }
  return { isGameOver };
};

module.exports = {
  // eslint-disable-next-line no-undef
  copyObj,
  isComplimentaryDirection,
  positionPrey,
  isPreyHunted,
  isGameOver,
};
