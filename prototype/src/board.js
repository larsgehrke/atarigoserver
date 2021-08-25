import React from 'react';
import wstone from './img/wstone.png';
import bstone from './img/bstone.png';
import intersection0 from './img/intersection0.png';
import intersection1 from './img/intersection1.png';
import intersection2 from './img/intersection2.png';
import intersection3 from './img/intersection3.png';
import intersection4 from './img/intersection4.png';
import intersection5 from './img/intersection5.png';
import intersection6 from './img/intersection6.png';
import intersection7 from './img/intersection7.png';
import intersection8 from './img/intersection8.png';
import intersection9 from './img/intersection9.png';


function Square(props) {

  let stone;
  
  if(props.value > 0) {
    stone = <img src={bstone} alt="White stone" width="100%"/>
  } else if (props.value < 0) {
    stone = <img src={wstone} alt="Black stone" width="100%"/>
  } else if(props.location === 0) {
    stone = <img src={intersection0} alt="Intersection Top Left" width="100%"/>
  } else if(props.location === 8) {
    stone = <img src={intersection2} alt="Intersection Top Right" width="100%"/>
  } else if(props.location === 72) {
    stone = <img src={intersection5} alt="Intersection Bottom Left" width="100%"/>
  } else if(props.location === 80) {
    stone = <img src={intersection7} alt="Intersection Bottom Right" width="100%"/>
  } else if(props.location > 0 && props.location < 8) {
    stone = <img src={intersection1} alt="Intersection Edge Top" width="100%"/>
  } else if((props.location-8) % 9 === 0) {
    stone = <img src={intersection4} alt="Intersection Edge Right" width="100%"/>
  } else if(props.location % 9 === 0) {
    stone = <img src={intersection3} alt="Intersection Edge Right" width="100%"/>
  } else if(props.location > 72 && props.location<80) {
    stone = <img src={intersection6} alt="Intersection Edge Right" width="100%"/>
  } else if ([20,24,40,56,60].includes(props.location)) {
    stone = <img src={intersection9} alt="Intersection Edge Right" width="100%"/>
  } else {
    stone = <img src={intersection8} alt="Intersection Edge Right" width="100%"/>
  } 



  return (
    <button className="square" onClick={props.onClick}>
      {stone}
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
        location={current_location}
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

export default Board; // Don’t forget to use export default!