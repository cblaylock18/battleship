// standard battleship has 5 ships
//  carrier (5 holes)
//  battleship (4 holes)
//  cruiser (3 holes)
//  submarine (3 holes)
//  destroyer (2 holes)

class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}

// Gameboard layout visual (called out in LETTER, NUMBER format)
//   1 2 3 4 5 6 7 8 9 10
// A
// B
// C
// D
// E
// F
// G
// H
// I
// J

class Gameboard {
  constructor() {
    this.carrier = {
      ship: new Ship(5),
      coordinates: [],
    };
    this.battleship = {
      ship: new Ship(4),
      coordinates: [],
    };
    this.cruiser = {
      ship: new Ship(3),
      coordinates: [],
    };
    this.submarine = {
      ship: new Ship(3),
      coordinates: [],
    };
    this.destroyer = {
      ship: new Ship(2),
      coordinates: [],
    };
    this.hits = [];
    this.misses = [];
  }

  placeShip(letterCoordinate, numberCoordinate, orientation, shipType) {
    let error;
    const uppercaseLetterCoordinate = letterCoordinate.toUpperCase();
    const allowedLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const letterIndex = allowedLetters.indexOf(uppercaseLetterCoordinate);

    const shipLength = this[shipType].ship.length;
    let shipCoordinates = [];
    const existingCoordinates = this.listShipLocations();
    let placeShip = true;

    if (
      (orientation === "horizontal" && shipLength + numberCoordinate > 11) ||
      (orientation === "vertical" && shipLength + letterIndex > 10) ||
      letterIndex === -1 ||
      numberCoordinate < 1 ||
      numberCoordinate > 10
    ) {
      error = "Ships must be placed entirely on the board.";
      placeShip = false;
    }

    for (let i = 0; i < shipLength; i++) {
      if (orientation === "horizontal") {
        shipCoordinates.push([uppercaseLetterCoordinate, numberCoordinate + i]);
      } else if (orientation === "vertical") {
        shipCoordinates.push([
          allowedLetters[letterIndex + i],
          numberCoordinate,
        ]);
      }
    }

    shipCoordinates.forEach((newCoordinate) => {
      existingCoordinates.forEach((oldCoordinate) => {
        if (
          newCoordinate[0] === oldCoordinate[0] &&
          newCoordinate[1] === oldCoordinate[1]
        ) {
          placeShip = false;
          error = "Ships cannot overlap.";
        }
      });
    });

    if (placeShip) {
      this[shipType].coordinates = shipCoordinates;
      return "placed";
    } else return error;
  }

  randomizeShips() {
    this.removeAllShips();
    const shipTypes = this.listShipTypes();

    shipTypes.forEach((ship) => {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 500;

      let coordinates = {
        horizontal: this.gameboardCoordinates(),
        vertical: this.gameboardCoordinates(),
      };

      while (!placed && attempts <= maxAttempts) {
        const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
        const randomIndex = Math.floor(
          Math.random() * coordinates[orientation].length,
        );
        const randomCoordinate = coordinates[orientation][randomIndex];

        const shipPlacementWorked = this.placeShip(
          randomCoordinate[0],
          randomCoordinate[1],
          orientation,
          ship,
        );
        if (shipPlacementWorked !== "placed") {
          coordinates[orientation].splice(randomIndex, 1);
          // try again
        } else {
          placed = true;
        }

        attempts++;
      }
    });
  }

  removeShip(ship) {
    this[ship].coordinates = [];
  }

  removeAllShips() {
    const shipTypes = this.listShipTypes();

    shipTypes.forEach((ship) => {
      this.removeShip(ship);
    });
  }

  receiveAttack(letterCoordinate, numberCoordinate) {
    const shipTypes = this.listShipTypes();
    let hit = false;

    shipTypes.forEach((ship) => {
      this[ship].coordinates.forEach((coordinate) => {
        if (
          coordinate[0] === letterCoordinate &&
          coordinate[1] === numberCoordinate
        ) {
          this.hits.push([letterCoordinate, numberCoordinate]);
          this[ship].ship.hit();
          hit = true;
          return;
        }
      });
    });

    if (hit === false) {
      this.misses.push([letterCoordinate, numberCoordinate]);
    }
  }

  listShipLocations() {
    let shipLocations = [];

    this.listShipTypes().forEach((ship) => {
      shipLocations = shipLocations.concat(this[ship].coordinates);
    });

    return shipLocations;
  }

  listGridCellsWithAssociatedShip() {
    let shipLocations = [];

    this.listShipTypes().forEach((ship) => {
      if (this[ship].coordinates.length === 0) {
      }

      const length = this[ship].ship.length;

      for (let i = 0; i < length; i++) {
        if (this[ship].coordinates.length === 0) {
        } else {
          shipLocations.push([
            [this[ship].coordinates[i][0] + this[ship].coordinates[i][1]],
            ship,
          ]);
        }
      }
    });
    return shipLocations;
  }

  listShipTypes() {
    return ["carrier", "battleship", "cruiser", "submarine", "destroyer"];
  }

  placedShips() {
    const allShipTypes = this.listShipTypes();
    let placedShips = 0;

    allShipTypes.forEach((shipType) => {
      if (this[shipType].coordinates.length > 0) {
        placedShips++;
      }
    });

    return placedShips;
  }

  allShipsPlaced() {
    return (this.placedShips = 5);
  }

  allShipsSunk() {
    let numberOfSunkenShips = 0;
    const allShipTypes = this.listShipTypes();

    allShipTypes.forEach((shipType) => {
      if (this[shipType].ship.isSunk()) {
        numberOfSunkenShips++;
      }
    });

    return numberOfSunkenShips === this.placedShips();
  }

  gameboardCoordinates() {
    const letters = "ABCDEFGHIJ".split("");
    return letters.flatMap((letter) =>
      Array.from({ length: 10 }, (_, index) => [letter, index + 1]),
    );
  }
}

class Player {
  constructor(player, type) {
    this.playerNumber = player;
    this.type = type;
    this.gameboard = new Gameboard();
    this._placesToAttack = this.gameboard.gameboardCoordinates();
  }

  AIAttack() {
    const randomIndex = Math.floor(Math.random() * this._placesToAttack.length);
    const randomCoordinate = this._placesToAttack[randomIndex];
    this._placesToAttack.splice(randomIndex, 1);
    return randomCoordinate;
  }

  reset() {
    this.gameboard = new Gameboard();
    this._placesToAttack = this.gameboard.gameboardCoordinates();
  }
}

export { Ship, Gameboard, Player };
