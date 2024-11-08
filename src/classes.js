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
    const allowedLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const letterIndex = allowedLetters.indexOf(letterCoordinate);

    const shipLength = this[shipType].ship.length;
    let shipCoordinates = [];
    const existingCoordinates = this.listShipLocations();

    if (
      (orientation === "horizontal" && shipLength + numberCoordinate > 11) ||
      (orientation === "vertical" && shipLength + letterIndex > 10) ||
      letterIndex === -1 ||
      numberCoordinate < 1 ||
      numberCoordinate > 10
    ) {
      throw new Error("ships must be placed entirely on the board");
    }

    for (let i = 0; i < shipLength; i++) {
      if (orientation === "horizontal") {
        shipCoordinates.push([letterCoordinate, numberCoordinate + i]);
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
          throw new Error("ships cannot overlap");
        }
      });
    });

    this[shipType].coordinates = shipCoordinates;
  }

  removeShip(ship) {
    this[ship].coordinates = [];
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
      const length = this[ship].ship.length;

      for (let i = 0; i < length; i++) {
        shipLocations.push([
          [this[ship].coordinates[i][0] + this[ship].coordinates[i][1]],
          ship,
        ]);
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

  allShipsSunk() {
    let numberOfSunkenShips = 0;
    let numberOfPlacedShips = this.placedShips();
    const allShipTypes = this.listShipTypes();

    allShipTypes.forEach((shipType) => {
      if (this[shipType].ship.isSunk()) {
        numberOfSunkenShips++;
      }
    });

    return numberOfSunkenShips === numberOfPlacedShips;
    // once game is fully implemented and players must start out with 5 ships, could reduce this logic to check if 5 ships are sunk
  }
}

class Player {
  constructor(player, type) {
    this.playerNumber = player;
    this.type = type;
    this.gameboard = new Gameboard();
    this._placesToAttack = [
      ["A", 1],
      ["A", 2],
      ["A", 3],
      ["A", 4],
      ["A", 5],
      ["A", 6],
      ["A", 7],
      ["A", 8],
      ["A", 9],
      ["A", 10],

      ["B", 1],
      ["B", 2],
      ["B", 3],
      ["B", 4],
      ["B", 5],
      ["B", 6],
      ["B", 7],
      ["B", 8],
      ["B", 9],
      ["B", 10],

      ["C", 1],
      ["C", 2],
      ["C", 3],
      ["C", 4],
      ["C", 5],
      ["C", 6],
      ["C", 7],
      ["C", 8],
      ["C", 9],
      ["C", 10],

      ["D", 1],
      ["D", 2],
      ["D", 3],
      ["D", 4],
      ["D", 5],
      ["D", 6],
      ["D", 7],
      ["D", 8],
      ["D", 9],
      ["D", 10],

      ["E", 1],
      ["E", 2],
      ["E", 3],
      ["E", 4],
      ["E", 5],
      ["E", 6],
      ["E", 7],
      ["E", 8],
      ["E", 9],
      ["E", 10],

      ["F", 1],
      ["F", 2],
      ["F", 3],
      ["F", 4],
      ["F", 5],
      ["F", 6],
      ["F", 7],
      ["F", 8],
      ["F", 9],
      ["F", 10],

      ["G", 1],
      ["G", 2],
      ["G", 3],
      ["G", 4],
      ["G", 5],
      ["G", 6],
      ["G", 7],
      ["G", 8],
      ["G", 9],
      ["G", 10],

      ["H", 1],
      ["H", 2],
      ["H", 3],
      ["H", 4],
      ["H", 5],
      ["H", 6],
      ["H", 7],
      ["H", 8],
      ["H", 9],
      ["H", 10],

      ["I", 1],
      ["I", 2],
      ["I", 3],
      ["I", 4],
      ["I", 5],
      ["I", 6],
      ["I", 7],
      ["I", 8],
      ["I", 9],
      ["I", 10],

      ["J", 1],
      ["J", 2],
      ["J", 3],
      ["J", 4],
      ["J", 5],
      ["J", 6],
      ["J", 7],
      ["J", 8],
      ["J", 9],
      ["J", 10],
    ];
  }

  AIAttack() {
    const randomIndex = Math.floor(Math.random() * this._placesToAttack.length);
    const randomCoordinate = this._placesToAttack[randomIndex];
    this._placesToAttack.splice(randomIndex, 1);
    return randomCoordinate;
  }
}

export { Ship, Gameboard, Player };
