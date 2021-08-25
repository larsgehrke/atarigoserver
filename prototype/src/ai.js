

module.exports = {
  /*
      currentGame: Array with length 81
      -> representing 9x9 field
      positive Numbers: black Stone
      negative Numbers: white Stone
      0: empty
  */

  /* player: -1 for white, 1 for black */

  playAIMove(currentGame, player) {
      // do smart logic

      // return number in [0-80] for your move
    const emptyPoints = [];
    let emptyPointsCounter = 0
    for (var i=0; i<81; i++){
      if (currentGame[i] === 0){
        emptyPoints[emptyPointsCounter] = i;
        emptyPointsCounter++;
      }
    }
    const baseline = emptyPoints[Math.floor(Math.random()*emptyPoints.length)]
    return baseline;
  }

}
