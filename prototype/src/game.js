import React from 'react';
import Select from 'react-select';
import Board from './board';
var ai = require('./ai');

    
const fieldSizes = [
    { value: 2, label: '2x2' },
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
    { value: 14, label: '14x14' },
    { value: 15, label: '15x15' },
    { value: 16, label: '16x16' },
    { value: 17, label: '17x17' },
    { value: 18, label: '18x18' },
    { value: 19, label: '19x19' },
    { value: 20, label: '20x20' },
    { value: 21, label: '21x21' },
  ]

function getNeighbourIdxs(idx, fieldSize) {
    var neighbours = [];

    if (idx % fieldSize !== 0){ // Not Left Edge
      neighbours.push(idx - 1);
    }        
    if (idx > fieldSize - 1) { // Not Top Edge
      neighbours.push(idx - fieldSize);
    }
        
    if (idx % fieldSize !== fieldSize - 1) { // Not Right Edge
      neighbours.push(idx + 1);
    }
        
    if (idx < fieldSize * (fieldSize - 1)) { // Not Bottom Edge
      neighbours.push(idx + fieldSize);
    }
        
    return neighbours;

  };


class Game extends React.Component {

  createNewGroup(isB, liberties) {
    // create new group
    var counter = null
    
    if(isB) {
       this.counter_black_groups++;
       counter = this.counter_black_groups
      this.groups.set(this.counter_black_groups, liberties);
    } else {
      this.counter_white_groups--;
      counter = this.counter_white_groups
      this.groups.set(this.counter_white_groups, liberties);
    }

    return counter;
  }

  isLegalMove(i,isB) {
    const history = this.state.history.slice(0, 
      this.state.stepNumber +1);
    const current = history[history.length -1 ];
    const field = current.squares.slice();
    const self = this

    if (field[i] !== 0) {
      return false;
    }

    const neighbours = getNeighbourIdxs(i, this.state.fieldSize.value); 

    const liberties = new Set();
    
    neighbours.forEach(function(element) {
      if (field[element] === 0) {
        liberties.add(element);
      }
    });


    if(liberties.size === 0) {
      var ret = false
      neighbours.forEach(function(element) {
        if ((field[element] >0 && isB) || (field[element] <0 && !isB)) {
          // friends can help me with liberties
          var friend_liberties = self.groups.get(field[element])
          
          
          if (friend_liberties.size > 1) {
            ret = true;
          }
          const iterator1 = friend_liberties.values();
          if (iterator1.next().value !== i) {
            ret = true;
          }
          
        } else if ((field[element] <0 && isB) || (field[element] >0 && !isB)) {
          // can capture enemies?
          var enemy_liberties = self.groups.get(field[element])
          if (enemy_liberties.size === 1) {
            ret = true;
          }
        }

      });

      return ret
    }
    return true;
  }

  getAllCurrentLegalMovels() {
    const history = this.state.history.slice(0, 
      this.state.stepNumber +1);
    const current = history[history.length -1 ];
    const field = current.squares.slice();
    const self = this

    var result = []
    for (var i=0; i<field.length; i++) {
      if(self.isLegalMove(i, self.bIsNext)) {
        result.push(i);
      }
    }

    return result;
  }
        


  handleClick(i) {
    if (!this.isLegalMove(i,this.bIsNext) || this.winner !== null) {
      // No legal move
      console.log("Move not possible");
      return;
    }
    const history = this.state.history.slice(0, 
      this.state.stepNumber +1);
    const current = history[history.length -1 ];
    const isB = this.bIsNext
    const field = current.squares.slice();
    const self = this

    // get neighbouring points (up to 4)
    const neighbours = getNeighbourIdxs(i, this.state.fieldSize.value); 

    const liberties = new Set();
    
    neighbours.forEach(function(element) {
      if (field[element] === 0) {
        liberties.add(element);
      }
    });
    
    if (liberties.size === neighbours.length) {
      field[i] = this.createNewGroup(isB,liberties);
      
    } else {
      let friend = null

      neighbours.forEach(function(element) {

        if((field[element] <0 && isB) || (field[element] >0 && !isB)) {

          // hostile neighbour
          // Reduce liberties of enemy
          var enemy_liberties = self.groups.get(field[element]);
          enemy_liberties.delete(i);
          self.groups.set(field[element],enemy_liberties);

          if(enemy_liberties.size === 0) {
            self.winner = field[element];      
          }
        } else if (field[element] !== 0 && friend === null) {
          // first friend
          friend = field[element];
        } else if (field[element] !== 0 && friend !== null) {
          // 2nd, ... friends
          // merge two groups
          var liberties_1 = self.groups.get(friend);
          var liberties_2 = self.groups.get(field[element]);

          for (let elem of liberties_2) {
              liberties_1.add(elem);
          }
          liberties_1.delete(i);
          self.groups.delete(field[element]);
          self.groups.set(friend, liberties_1);
          
          const groupToDelete = field[element];
          for (let i=0; i<field.length; i++) {
            if(field[i] === groupToDelete) {
              // Overwrite old groupIds with new one
              field[i] = friend;
            }
          }

        }

      });

      if (friend !== null) {
        field[i] = friend;
        var liberties_friend = this.groups.get(friend);
        liberties_friend.delete(i);
        for (var elem of liberties) {
              liberties_friend.add(elem);
          }
        this.groups.set(friend,liberties_friend);
        if(liberties_friend.size === 0 && this.winner === null) {
          // Move not allowed
          return;
        }
      } else if (self.winner === null && liberties.size === 0) {
        // Move not allowed
        return;
      } else {
        field[i] = self.createNewGroup(isB,liberties);
      }
    }

    if(this.winner) {
      for (i=0;i<field.length;i++) {
        if(field[i] === this.winner) {
          field[i] = 0;
        }
      }
    }

    var aiTurn = function() {
      
      const allLegalMoves = this.getAllCurrentLegalMovels();

      if(allLegalMoves.length > 0) {
        // ask AI for next move
        var move = ai.playAIMove(field, -1, allLegalMoves);
        this.handleClick(move);
      } else {
        // skip whites turn:
        this.bIsNext = true;
        this.forceUpdate(); // force re-render
      }
      
      
    }
    
    if(isB) {
      if(this.winner === null) {
      this.bIsNext = !this.bIsNext;
      }
      this.setState({
        history: history.concat([{
          squares: field,
        }]),
        stepNumber: history.length,
      }, aiTurn);
    } else {
      if(this.winner === null) {
      this.bIsNext = !this.bIsNext;
      }
      this.setState({
        history: history.concat([{
          squares: field,
        }]),
        stepNumber: history.length,
      });
    }

    
  };

  handleChange = fieldSize => {
    const fieldLength = fieldSize.value * fieldSize.value;
    this.winner = null;
    this.setState({ 
      fieldSize: fieldSize,
      });
    this.setState({ 
      fieldLength: fieldLength,
      history: [{
          squares: Array(fieldLength).fill(0),
        }], 
      stepNumber:0,
      groups: new Map(),
      counter_black_groups: 0,
      counter_white_groups: 0,
      winner: null,
      });
  };

  jumpTo(step) {
    this.bIsNext = (step % 2) === 0;
    this.setState({
      stepNumber: step
    });
  }

  constructor(props) {
    super(props);
    this.counter_black_groups = 0;
    this.counter_white_groups = 0;
    this.groups = new Map();
    this.winner = null;
    this.bIsNext = true;
      this.state = {
        history: [{
          squares: Array(81).fill(0),
        }],
        stepNumber:0,
        fieldSize: { value: 9, label: '9x9' },
        fieldLength: 81,
      };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.winner;
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
      const winner_str = winner < 0 ?"Black": "White";
      status = 'Winner: ' + winner_str;
    } else {
      status = 'Next player: ' + (this.bIsNext ? 'Black': 'White');
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
            legalMoves= {this.getAllCurrentLegalMovels()}
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

export default Game; // Don???t forget to use export default!
