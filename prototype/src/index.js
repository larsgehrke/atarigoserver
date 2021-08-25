import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Select from 'react-select'

const fieldSizes = [
    { value: 3, label: '3x3' },
    { value: 4, label: '4x4' },
    { value: 5, label: '5x5' },
    { value: 6, label: '6x6' },
    { value: 7, label: '7x7' },
    { value: 8, label: '8x8' },
    { value: 9, label: '9x9' },
    { value: 10, label: '10x10' },
    { value: 11, label: '11x11' },
    { value: 12, label: '12x12' },
    { value: 13, label: '13x13' },
  ]

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
    );
}

class BoardRow extends React.Component {

  render() {

    var columns = [];
    for (var i = 0; i < this.props.fieldSize.value; i++) {
      const current_location = this.props.idx * this.props.fieldSize.value + i
      
      columns.push(<Square 
        key={current_location}
        value={this.props.squares[current_location]}
        onClick={ () => this.props.onClick(current_location)}
      />);
     
    }
    return (
    <div className="board-row">
    {columns}
    </div>
    );
  }
}


class Board extends React.Component {

  
  render() {

    var rows = [];
    for (var i = 0; i < this.props.fieldSize.value; i++) {
      rows.push(<BoardRow 
        key={i} 
        idx={i}
        fieldSize = {this.props.fieldSize}
        squares = {this.props.squares}
        onClick = {this.props.onClick}
        />);
     
    }

   

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  handleClick(i) {
    const history = this.state.history.slice(0, 
      this.state.stepNumber +1);
    const current = history[history.length -1 ];
    const squares = current.squares.slice();
    if (calculateWinnerJens(squares, this.state.fieldSize.value) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }

  handleChange = fieldSize => {
    const fieldLength = fieldSize.value * fieldSize.value
    this.setState({ 
      fieldSize: fieldSize,
      });
    this.setState({ 
      fieldLength: fieldLength,
      history: [{
          squares: Array(fieldLength).fill(null),
        }], 
      stepNumber:0,
      xIsNext: true,
      });
  };

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  constructor(props) {
    super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        xIsNext: true,
        stepNumber:0,
        fieldSize: { value: 3, label: '3x3' },
        fieldLength: 9,
      }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinnerJens(current.squares, this.state.fieldSize.value);
    const { fieldSize } = this.state;

    const moves = history.map((step,move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
          {desc} </button>
        </li>
      );
    });


    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
      if(this.state.stepNumber >= this.state.fieldLength) {
        status = 'Game is over. No winner.';
      }
    }

    return (
      <div className="game">
        <div className="game-params">
          <Select 
            value = {fieldSize}
            onChange={this.handleChange}
            options={fieldSizes}
            />
        </div>
        <div className="game-board">
          <Board 
            fieldSize={fieldSize}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
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

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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

function calculateWinnerJens(squares, fieldSize) {
  const lines = winningLines(fieldSize)
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return squares[a];
    }
  }
  return null;
}

function calculateWinner(squares, fieldSize) {

  if(fieldSize === 3) {
    return calculateWinnerFor3x3(squares);
  }
  else {
    for (var i=0;i<fieldSize;i++) {
      let o_horizontal = true
      let o_vertical = true
      let x_horizontal = true
      let x_vertical = true
      for (var j=0;j<fieldSize;j++){
        let pos_horizontal = i*fieldSize+j;
        let pos_vertical = j*fieldSize + i;
        if(squares[pos_horizontal] === null) {
          o_horizontal = false;
          x_horizontal = false;
        }
        if(squares[pos_vertical] === null) {
          o_vertical = false;
          x_vertical = false;
        }
        if(squares[pos_horizontal] === 'X') {
          o_horizontal = false
        }
        if(squares[pos_vertical] === 'X') {
          o_vertical = false
        }
        if(squares[pos_horizontal] === 'O') {
          x_horizontal = false
        }
        if(squares[pos_vertical] === 'O') {
          x_vertical = false
        }
      }
      if(o_horizontal || o_vertical) {
        return 'O';
      }
      if(x_horizontal || x_vertical) {
        return 'X';
      }
    }

    // Dimensional line
    let o_dim1 = true
    let o_dim2 = true
    let x_dim1 = true
    let x_dim2 = true
    for (j=0;j<fieldSize;j++){
      let pos1 = fieldSize*j +j;
      let pos2 = fieldSize*(fieldSize-1-j)+j;
      if(squares[pos1] === null) {
        o_dim1 = false;
        x_dim1 = false;
      }
      if(squares[pos1] === 'X') {
        o_dim1 = false;
      }
      if(squares[pos1] === 'O') {
        x_dim1 = false;
      }
      if(squares[pos2] === null) {
        o_dim2 = false;
        x_dim2 = false;
      }
      if(squares[pos2] === 'X') {
        o_dim2 = false;
      }
      if(squares[pos2] === 'O') {
        x_dim2 = false;
      }
    }
    if(o_dim1 || o_dim2) {
      return 'O';
    }
    if(x_dim1 || x_dim2) {
      return 'X';
    }
    

    return null;
  }
}

function calculateWinnerFor3x3(squares) {
  
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

