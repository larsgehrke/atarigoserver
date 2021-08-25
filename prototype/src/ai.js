

module.exports = {
  /*
      currentGame: Array with length 81
      -> representing 9x9 field
      positive Numbers: black Stone
      negative Numbers: white Stone
      0: empty
  */

  /* player: -1 for white, 1 for black */

  playAIMove(currentGame, player, legalMoves) {
      // do smart logic
    //console.log(legalMoves.length);
      // return number in [0-80] for your move
    const baseline = legalMoves[Math.floor(Math.random() * legalMoves.length)]
    return baseline;
  }

}
