import React from 'react';
import Select from 'react-select';
import Board from './board';
var ai = require('./ai');

    
const fieldSizes = [
    { value: 9, label: '9x9' },
  ]

function getNeighbourIdxs(idx) {
    var neighbours = [];

    if (idx % 9 !== 0){ // Left
      neighbours.push(idx - 1);
    }        
    if (idx > 8) {
      neighbours.push(idx - 9);
    }
        
    if (idx % 9 !== 8) {
      neighbours.push(idx + 1);
    }
        
    if (idx < 72) {
      neighbours.push(idx + 9);
    }
        
    return neighbours;

  };


class Game extends React.Component {

  createNewGroup(isB, liberties) {
    // create new group
    var groups = this.groups;
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

    this.groups = groups

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

    var neighbours = getNeighbourIdxs(i); 

    var liberties = new Set();
    
    neighbours.forEach(function(element) {
      if (field[element] === 0) {
        liberties.add(element);
      }
    });


    if(liberties.size === 0) {
      neighbours.forEach(function(element) {
        if ((field[element] >0 && isB) || (field[element] <0 && !isB)) {
          var enemy_liberties = self.groups.get(field[element])
          if (enemy_liberties) {
            if (enemy_liberties.size > 1) {
              return true;
            }
            const iterator1 = enemy_liberties.values();
            if (iterator1.next().value !== i) {
              return true;
            }
          } 
        }

      });
      return false;
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

    console.log(result)
    return result;
  }
        


  handleClick(i) {
    const history = this.state.history.slice(0, 
      this.state.stepNumber +1);
    const current = history[history.length -1 ];
    const isB = this.bIsNext
    const field = current.squares.slice();
    const self = this
    if (field[i]!==0 || this.winner) {
      return;
    }

    var neighbours = getNeighbourIdxs(i); 

    var liberties = new Set();
    
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
          var enemy_liberties = self.groups.get(field[element])
          enemy_liberties.delete(i);
          self.groups.set(field[element],enemy_liberties);
          if(enemy_liberties.size === 0) {
            self.winner = field[element];      
          }
        } else if (field[element] !== 0 && friend === null) {
          friend = field[element];
        } else if (field[element] !== 0 && friend !== null) {
          // merge two groups
          var liberties_1 = self.groups.get(friend)
          var liberties_2 = self.groups.get(field[element])
          for (var elem of liberties_2) {
              liberties_1.add(elem);
          }
          self.groups.delete(field[element])
          self.groups.set(friend, liberties_1)
        }

      });

      if (friend) {
        field[i] = friend;
        var liberties_friend = this.groups.get(friend);
        liberties_friend.delete(i);
        for (var elem of liberties) {
              liberties_friend.add(elem);
          }
        this.groups.set(friend,liberties_friend);
        if(liberties_friend.size === 0 && this.winner === null) {
          // Move not allowed, lost the game
          this.winner = field[i];
        }
      } else if (self.winner === null && liberties.size === 0) {
        // Move not allowed, lost the game
        this.winner = field[i];
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
      
      // ask AI for next move
      var move = ai.playAIMove(field, -1, this.getAllCurrentLegalMovels());
      this.handleClick(move);
      
    }
    
    if(isB) {
      this.bIsNext = !this.bIsNext;
      this.setState({
        history: history.concat([{
          squares: field,
        }]),
        stepNumber: history.length,
      }, aiTurn);
    } else {
      this.bIsNext = !this.bIsNext;
      this.setState({
        history: history.concat([{
          squares: field,
        }]),
        stepNumber: history.length,
      });
    }

    

    
  };

  handleChange = fieldSize => {
    const fieldLength = fieldSize.value * fieldSize.value
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

  /*

  let map = new Map();
  map.set('key', {'value1', 'value2'});
  let values = map.get('key');

  */

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

export default Game; // Don’t forget to use export default!
