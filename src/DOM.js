class DOM {
  static renderBoard(player, playerNumber) {
    let playerBoard;

    if (playerNumber === 1) {
      playerBoard = document.querySelector(".playerOne");
    } else {
      playerBoard = document.querySelector(".playerTwo");
    }

    playerBoard = Array.from(playerBoard.children);

    const shipLocations = this.combineCoordinates(
      player.gameboard.listShipLocations(),
    );
    const hits = this.combineCoordinates(player.gameboard.hits);
    const misses = this.combineCoordinates(player.gameboard.misses);

    this.renderShips(shipLocations, playerBoard);
    this.renderHits(hits, playerBoard);
    this.renderMisses(misses, playerBoard);
  }

  static renderShips(shipLocations, board) {
    // need to use logic here to say the first 5 points are a ship, next 4 are a ship, next 3, next 3, and last 2
    // maybe a better way to do this if change backend logic somewhere?
    board.forEach((gametile) => {
      const coordinateData = gametile.dataset.coordinate;

      for (let i = 0; i < 5; i++) {
        if (coordinateData === shipLocations[i]) {
          gametile.classList.add("carrier");
        }
      }
    });
  }

  static renderHits(hits, board) {}

  static renderMisses(misses, board) {}

  static combineCoordinates(array) {
    let newArray = [];
    array.forEach((coordinatePair) => {
      newArray.push(coordinatePair[0] + coordinatePair[1]);
    });
    return newArray;
  }
}

export { DOM };
