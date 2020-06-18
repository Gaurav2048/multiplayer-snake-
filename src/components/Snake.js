import React from 'react';
import Square from './Square';
import Prey from './Prey';
import {
  copyObj,
  isGameOver,
  positionPrey,
  isPreyHunted,
} from '../utils/index';
import '../App.css';

class Snake extends React.Component {
  constructor() {
    super();
    this.state = {
      Snake: [{ top: 39, left: 39, direction: 38 }],
      isGameOn: false,
      hasStarted: false,
      isDirectionChanged: true,
      isGameOver: false,
      direction: 38,
    };
  }

  // the lifecycle method that hooks cannot do.
  componentWillMount() {}

  componentDidMount() {
    document.addEventListener('keydown', this.onNavigationActionPressed, false);
    this.setState(positionPrey());
  }

  componentWillUnmount() {
    document.removeEventListener(
      'keydown',
      this.onNavigationActionPressed,
      false
    );
  }

  reposition = async () => {
    await setTimeout(() => {
      const newSnake = this.state.Snake;

      for (let i = newSnake.length - 1; i >= 1; i--) {
        newSnake[i].direction = newSnake[i - 1].direction;
      }

      if (this.state.isDirectionChanged) {
        newSnake[0].direction = this.state.direction;
      }

      newSnake.map((square, index) => {
        if (square.direction === 38) square.top -= 2;
        else if (square.direction === 39) square.left += 2;
        else if (square.direction === 40) square.top += 2;
        else if (square.direction === 37) square.left -= 2;
        return square;
      });

      if (
        isPreyHunted(
          { left: this.state.preyLeft, top: this.state.preyTop },
          { top: newSnake[0].top, left: newSnake[0].left }
        )
      ) {
        this.props.score();
        this.increaseLength();
        this.setState(positionPrey());
      }

      this.setState(isGameOver(this.state.Snake));
      this.setState({ Snake: newSnake, isDirectionChanged: false });
      if (!this.state.isGameOver) this.reposition();
      else alert('game Over!');
    }, this.props.speed);
  };

  increaseLength = () => {
    const obj = copyObj(this.state.Snake[this.state.Snake.length - 1]);
    if (obj.direction === 38) {
      // nth square of the snake moving top
      obj.top = obj.top + 2;
    } else if (obj.direction === 39) {
      // nth square of the snake moving right
      obj.left = obj.left - 2;
    } else if (obj.direction === 40) {
      obj.top -= 2;
    } else if (obj.direction === 37) {
      obj.left += 2;
    }

    const newSnake = this.state.Snake;
    newSnake.push(obj);
    this.setState({
      Snake: newSnake,
    });
  };

  onNavigationActionPressed = (e) => {
    if (e.keyCode === 32) {
      if (this.state.hasStarted === false) {
        this.reposition();
        this.setState({
          hasStarted: true,
          isGameOn: true,
        });
      }
    } else {
      if (this.state.Snake[0].direction !== e.keyCode) {
        if (
          e.keyCode === 38 ||
          e.keyCode === 37 ||
          e.keyCode === 39 ||
          e.keyCode === 40
        ) {
          this.setState(
            {
              isDirectionChanged: true,
              direction: e.keyCode,
            },
            () => {
              if (this.state.isGameOn) {
                this.props.keyCode(e.keyCode);
              }
            }
          );
        }
      }
    }
  };

  render() {
    return (
      <div>
        {this.state.Snake.map((square, index) => (
          <Square left={square.left} top={square.top} key={index} />
        ))}
        <Prey left={this.state.preyLeft} top={this.state.preyTop} />
      </div>
    );
  }
}

export default Snake;
