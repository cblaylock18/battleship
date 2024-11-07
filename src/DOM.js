class DOM {
  static renderBoard(player, playerNumber) {
    let playerBoard;

    if (playerNumber === 1) {
      playerBoard = document.querySelector(".playerOne");
    } else {
      playerBoard = document.querySelector(".playerTwo");
    }

    const shipLocations = player.gameboard.listGridCellsWithAssociatedShip();
    const hits = this.combineCoordinates(player.gameboard.hits);
    const misses = this.combineCoordinates(player.gameboard.misses);

    this.renderShips(shipLocations, playerBoard);
    this.renderHits(hits, playerBoard);
    this.renderMisses(misses, playerBoard);
  }

  static renderShips(shipLocations, board) {
    shipLocations.forEach((shipLocation) => {
      const gridCell = board.querySelector(
        `[data-coordinate="${shipLocation[0]}"]`,
      );

      gridCell.classList.add(`${shipLocation[1]}`);
    });
  }

  static renderHits(hits, board) {
    hits.forEach((hit) => {
      const gridCell = board.querySelector(`[data-coordinate="${hit}"]`);

      gridCell.classList.add("hit");
    });
  }

  static renderMisses(misses, board) {
    misses.forEach((miss) => {
      const gridCell = board.querySelector(`[data-coordinate="${miss}"]`);

      gridCell.classList.add("miss");
    });
  }

  static combineCoordinates(array) {
    let newArray = [];
    array.forEach((coordinatePair) => {
      newArray.push(coordinatePair[0] + coordinatePair[1]);
    });
    return newArray;
  }
}

export { DOM };
