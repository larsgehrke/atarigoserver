/* Versuchen zu überlegen, wie man bei bestehendem Code das TicTacToe-Feld zu einem TicTacTecTucToe-Feld erweitern kann. */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
        </div>
        <div className="board-row">
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}
        </div>
        <div className="board-row">
          {this.renderSquare(10)}
          {this.renderSquare(11)}
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
        </div>
        <div className="board-row">
          {this.renderSquare(15)}
          {this.renderSquare(16)}
          {this.renderSquare(17)}
          {this.renderSquare(18)}
          {this.renderSquare(19)}
        </div>
        <div className="board-row">
          {this.renderSquare(20)}
          {this.renderSquare(21)}
          {this.renderSquare(22)}
          {this.renderSquare(23)}
          {this.renderSquare(24)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldSize: 5,
      fieldNumber: this.fieldSize ** 2,
      history: [
        {
          squares: Array(this.fieldNumber).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            fieldSize = {this.state.fieldSize}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function winningLines (fieldSize) {
  const lines = [];
  let counter = 0;
  let k = 0;
  for (let i = 2; i < fieldSize - 2; i++) {
    for (let j = 2; i < fieldSize - 2; i++) {
      k = fieldSize * i + j
      lines[counter] = [k-2-2*fieldSize, k-1-2*fieldSize, k-2*fieldSize, k+1-2*fieldSize, k+2-2*fieldSize] /* waagerecht 1 */
      counter++;
      lines[counter] = [k-2-fieldSize, k-1-fieldSize, k-fieldSize, k+1-fieldSize, k+2-fieldSize] /* waagerecht 2 */
      counter++;
      lines[counter] = [k-2, k-1, k, k+1, k+2] /* waagerecht 3 */
      counter++;
      lines[counter] = [k-2+fieldSize, k-1+fieldSize, k+fieldSize, k+1+fieldSize, k+2+fieldSize] /* waagerecht 4 */
      counter++;
      lines[counter] = [k-2+2*fieldSize, k-1+2*fieldSize, k+2*fieldSize, k+1+2*fieldSize, k+2+2*fieldSize] /* waagerecht 5 */
      counter++;
      
      lines[counter] = [k-2*fieldSize-2, k-fieldSize-2, k-2, k+fieldSize-2, k+2*fieldSize-2] /* senkrecht 1*/
      counter++;
      lines[counter] = [k-2*fieldSize-1, k-fieldSize-1, k-1, k+fieldSize-1, k+2*fieldSize-1] /* senkrecht 2*/
      counter++;
      lines[counter] = [k-2*fieldSize, k-fieldSize, k, k+fieldSize, k+2*fieldSize] /* senkrecht 3*/
      counter++;
      lines[counter] = [k-2*fieldSize+1, k-fieldSize+1, k+1, k+fieldSize+1, k+2*fieldSize+1] /* senkrecht 4*/
      counter++;
      lines[counter] = [k-2*fieldSize+2, k-fieldSize+2, k+2, k+fieldSize+2, k+2*fieldSize+2] /* senkrecht 5*/
      counter++;

      lines[counter] = [k-2+2*fieldSize, k-1+fieldSize, k, k-fieldSize, k+2-2*fieldSize] /* diagonal von links unten nach rechts oben */
      counter++;
      lines[counter] = [k-2-2*fieldSize, k-1-fieldSize, k, k+1+fieldSize, k+2+2*fieldSize] /* diagonal von links oben nach rechts unten */
      counter++;     
    }
  }
  return lines;
} 

function calculateWinner(squares) {
  const lines = winningLines(5)
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return squares[a];
    }
  }
  return null;
}

