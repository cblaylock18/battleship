class DOM {
  static prepBoardForAttackClickEvents(playerOne, playerTwo) {
    const playerBoard = document.querySelector(`.${playerTwo.playerNumber}`);
    const playerBoardTiles = Array.from(playerBoard.children);

    function playerAttackFn(event) {
      const coordinateArray = DOM.splitCoordinates(
        event.target.dataset.coordinate,
      );

      playerTwo.gameboard.receiveAttack(coordinateArray[0], coordinateArray[1]);
      DOM.renderHits(playerTwo);
      DOM.renderMisses(playerTwo);

      if (DOM.checkForWin(playerTwo)) {
        setTimeout(() => {
          alert("You win!!");
        }, 0);
        playerBoard.style.pointerEvents = "none";
        // clear board and reset game function #1/2
      } else {
        event.target.removeEventListener("click", playerAttackFn);
        playerBoard.style.pointerEvents = "none";
        DOM.computersTurn(playerOne, playerTwo);
        playerBoard.style.pointerEvents = "auto";
      }
    }

    playerBoardTiles.forEach((gametile) => {
      gametile.addEventListener("click", playerAttackFn);
    });
  }

  static renderPlayerBoards(playerOne, playerTwo) {
    this.renderShips(playerOne);
    this.renderHits(playerOne);
    this.renderMisses(playerOne);

    this.renderHits(playerTwo);
    this.renderMisses(playerTwo);
    this.prepBoardForAttackClickEvents(playerOne, playerTwo);
  }

  static renderShips(player) {
    const board = document.querySelector(`.${player.playerNumber}`);
    const shipLocations = player.gameboard.listGridCellsWithAssociatedShip();

    shipLocations.forEach((shipLocation) => {
      const gridCell = board.querySelector(
        `[data-coordinate="${shipLocation[0]}"]`,
      );

      gridCell.classList.add(`${shipLocation[1]}`);
    });
  }

  static renderHits(player) {
    const board = document.querySelector(`.${player.playerNumber}`);
    const hits = this.combineCoordinates(player.gameboard.hits);

    hits.forEach((hit) => {
      const gridCell = board.querySelector(`[data-coordinate="${hit}"]`);

      gridCell.classList.add("hit");
    });
  }

  static renderMisses(player) {
    const board = document.querySelector(`.${player.playerNumber}`);
    const misses = this.combineCoordinates(player.gameboard.misses);

    misses.forEach((miss) => {
      const gridCell = board.querySelector(`[data-coordinate="${miss}"]`);

      gridCell.classList.add("miss");
    });
  }

  static computersTurn(humanPlayer, computerPlayer) {
    const computersAttackCoordinates = computerPlayer.AIAttack();

    humanPlayer.gameboard.receiveAttack(
      computersAttackCoordinates[0],
      computersAttackCoordinates[1] * 1,
    );
    this.renderHits(humanPlayer);
    this.renderMisses(humanPlayer);
    if (this.checkForWin(humanPlayer)) {
      setTimeout(() => {
        alert("Better luck next time!");
      }, 0);
      // clear board and reset game function #2/2
    }
  }

  static checkForWin(player) {
    if (player.gameboard.allShipsSunk()) {
      return true;
    }
    return false;
  }

  static preGame() {
    // function that adds event listener and prevent default and all that to play button
    // also maybe updates the player boards automatically as ship locations are chosen
    // is that like a listen for change in select and coordinates???
  }

  //   helper functions for transforming coordinates as needed for use in data attributes
  static combineCoordinates(array) {
    let newArray = [];
    array.forEach((coordinatePair) => {
      newArray.push(coordinatePair[0] + coordinatePair[1]);
    });
    return newArray;
  }

  static splitCoordinates(coordinate) {
    return [coordinate.at(0), coordinate.slice(1) * 1];
  }
}

export { DOM };
