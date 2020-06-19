import React from 'react';
import Square from './Square';
import { copyObj, isGameOver, isPreyHunted } from '../utils/index';
import '../App.css';

class Snake extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Snake: [{ top: 39, left: 39, direction: 38 }],
      isGameOn: false,
      hasStarted: false,
      isDirectionChanged: true,
      isGameOver: false,
      direction: 38,
      preyLeft: this.props.preyLeft,
      preyTop: this.props.preyTop,
    };
  }

  // the lifecycle method that hooks cannot do.
  componentWillMount() {}

  componentDidMount() {
    if (this.props.listenToNativeEvents) {
      document.addEventListener(
        'keydown',
        this.onNavigationActionPressed,
        false
      );
    }

    // if (this.state.Snake.length !== this.props.score) {
    //   for (let i = 0; i < this.props.score - this.state.Snake.length; i++) {
    //     this.increaseLength();
    //   }
    // }
  }

  componentDidUpdate() {
    if (!this.props.listenToNativeEvents) {
      if (this.props.hasStarted && !this.state.isGameOn) {
        console.log('aca', this.props.hasStarted);
        this.setState(
          {
            isGameOn: true,
          },
          () => {
            this.reposition();
          }
        );
      } else {
        console.log('not started.', this.props.hasStarted);
      }

      // update length on score .

      if (this.props.score !== this.state.Snake.length - 1) {
        console.log('inc length');

        this.increaseLength();
      } else {
        console.log('donot inc length');
      }
    }
  }

  componentWillUnmount() {
    if (this.props.listenToNativeEvents) {
      document.removeEventListener(
        'keydown',
        this.onNavigationActionPressed,
        false
      );
    }
  }

  reposition = async () => {
    console.log('on reposition.', this.props.speed);

    await setTimeout(() => {
      const newSnake = this.state.Snake;

      for (let i = newSnake.length - 1; i >= 1; i--) {
        newSnake[i].direction = newSnake[i - 1].direction;
      }

      if (this.props.listenToNativeEvents) {
        if (this.state.isDirectionChanged) {
          newSnake[0].direction = this.state.direction;
        }
      } else {
        if (this.props.isDirectionChanged) {
          newSnake[0].direction = this.props.direction;
        }
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
          { left: this.props.preyLeft, top: this.props.preyTop },
          { top: newSnake[0].top, left: newSnake[0].left }
        )
      ) {
        // this.props.score();
        this.increaseLength();
        // fire catch callback
        this.props.onHunt({ snakeId: this.props.snakeId });
        console.log('prey cought');
      }

      this.setState(isGameOver(this.state.Snake));

      if (this.props.listenToNativeEvents) {
        this.setState({ Snake: newSnake, isDirectionChanged: false });
        if (!this.state.isGameOver) this.reposition();
        else alert('game Over!');
      } else {
        this.setState({ Snake: newSnake }, () => {
          this.props.resetDirectionChange(this.props.snakeId);
        });
        if (!this.state.isGameOver) this.reposition();
        else alert('game Over!');
      }
    }, 400);
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
      if (!this.props.listenToNativeEvents) {
        return;
      }
      if (this.state.hasStarted === false) {
        this.reposition();
        this.setState(
          {
            hasStarted: true,
            // isGameOn: true,
          },
          () => {
            this.props.keyCode({
              snakeId: this.props.snakeId,
              type: 'start',
              keyCode: e.keyCode,
            });
          }
        );
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
              if (this.state.hasStarted) {
                this.props.keyCode({
                  keyCode: e.keyCode,
                  snakeId: this.props.snakeId,
                  type: 'move',
                });
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
          <Square
            left={square.left}
            top={square.top}
            key={index}
            color={this.props.color}
          />
        ))}
      </div>
    );
  }
}

export default Snake;
