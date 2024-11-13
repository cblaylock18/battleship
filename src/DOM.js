class DOM {
  static playerAttackFn(attackingPlayer, defendingPlayer, event) {
    const defendingBoard = document.querySelector(
      `.${defendingPlayer.playerNumber}`,
    );
    const gametile = event.target;
    const coordinateArray = DOM.splitCoordinates(gametile.dataset.coordinate);

    defendingPlayer.gameboard.receiveAttack(
      coordinateArray[0],
      coordinateArray[1],
    );
    DOM.renderHits(defendingPlayer);
    DOM.renderMisses(defendingPlayer);

    if (DOM.checkForWin(defendingPlayer)) {
      setTimeout(() => {
        alert("You win!!");
      }, 0);
      setTimeout(() => {
        document.querySelector("#reset-game-btn").click();
      }, 0);
    } else {
      gametile.removeEventListener("click", gametile.boundPlayerAttackFn);
      delete gametile.boundPlayerAttackFn; //
      gametile.style.cursor = "auto";
      defendingBoard.style.pointerEvents = "none";
      DOM.computersTurn(attackingPlayer, defendingPlayer);
      defendingBoard.style.pointerEvents = "auto";
    }
  }

  static prepBoardForAttackClickEvents(attackingPlayer, defendingPlayer) {
    const defendingBoard = document.querySelector(
      `.${defendingPlayer.playerNumber}`,
    );
    const defendingTiles = Array.from(
      defendingBoard.querySelectorAll(".gametile"),
    );

    const boundPlayerAttackFn = this.playerAttackFn.bind(
      this,
      attackingPlayer,
      defendingPlayer,
    );

    defendingTiles.forEach((gametile) => {
      gametile.style.cursor = "pointer";
      gametile.addEventListener("click", boundPlayerAttackFn);
      gametile.boundPlayerAttackFn = boundPlayerAttackFn;
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

  static preGame(playerOne, playerTwo) {
    const playGameForm = document.querySelector("#player-one-form");
    const playBtn = playGameForm.querySelector("#play-game-btn");
    const resetBtn = playGameForm.querySelector("#reset-game-btn");

    const shipTypes = playerOne.gameboard.listShipTypes();

    const placeShipsFn = (event) => {
      playerOne.gameboard.removeAllShips();
      DOM.clearBoards();
      let error = false;

      event.preventDefault();
      if (!playGameForm.checkValidity()) {
        playGameForm.reportValidity();
      } else {
        shipTypes.forEach((ship) => {
          const coordinateInput = playGameForm.querySelector(
            `#${ship}-coordinates`,
          );
          const orientationInput = playGameForm.querySelector(
            `#${ship}-orientation`,
          );
          const errorSpan = playGameForm.querySelector(`.${ship}-error-span`);

          const rawCoordinates = coordinateInput.value;
          const updatedCoordinates = DOM.splitCoordinates(rawCoordinates);
          const orientation = orientationInput.value;
          errorSpan.textContent = "";

          const shipPlacementWorked = playerOne.gameboard.placeShip(
            updatedCoordinates[0],
            updatedCoordinates[1],
            orientation,
            ship,
          );
          if (shipPlacementWorked !== "placed") {
            errorSpan.textContent = `${ship.slice(0, 1).toUpperCase()}${ship.slice(1)} has an error. ${shipPlacementWorked}`;
            error = true;
          }
        });
        if (error) {
          DOM.renderShips(playerOne);
        } else {
          playBtn.disabled = true;
          playerTwo.gameboard.randomizeShips();
          DOM.renderPlayerBoards(playerOne, playerTwo);
        }
      }
    };

    playGameForm.addEventListener("submit", placeShipsFn);

    shipTypes.forEach((ship) => {
      const coordInput = playGameForm.querySelector(`#${ship}-coordinates`);

      // Clear custom validity on coordinate input
      coordInput.addEventListener("input", () => {
        coordInput.setCustomValidity("");
      });
    });

    const resetGameFn = () => {
      playerOne.reset();
      playerTwo.reset();
      DOM.clearBoards();
      playBtn.disabled = false;
    };

    resetBtn.addEventListener("click", resetGameFn);
  }

  static clearBoards() {
    const gameTiles = Array.from(document.querySelectorAll(".gametile"));

    gameTiles.forEach((gametile) => {
      gametile.className = "gametile";
      gametile.style.cursor = "auto";

      if (gametile.boundPlayerAttackFn) {
        gametile.removeEventListener("click", gametile.boundPlayerAttackFn);
        delete gametile.boundPlayerAttackFn;
      }
    });
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
