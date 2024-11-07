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
      (orientation === "horizontal" && shipLength + numberCoordinate > 10) ||
      (orientation === "vertical" && shipLength + letterIndex > 9) ||
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
  constructor(type) {
    this.type = type;
    this.gameboard = new Gameboard();
  }
}

export { Ship, Gameboard, Player };
