import { Ship, Gameboard, Player } from "./classes.js";

describe("ship class tests", () => {
  let carrier;

  beforeEach(() => {
    carrier = new Ship(5);
  });

  test("ship length matches expected value", () => {
    expect(carrier.length).toBe(5);
  });

  test("ship logs a hit after each hit() call", () => {
    expect(carrier.hits).toBe(0);
    carrier.hit();
    expect(carrier.hits).toBe(1);
    carrier.hit();
    expect(carrier.hits).toBe(2);
    carrier.hit();
    expect(carrier.hits).toBe(3);
  });

  test("ship is sunk after appropriate number of hits", () => {
    carrier.hit();
    carrier.hit();
    carrier.hit();
    carrier.hit();
    carrier.hit();
    expect(carrier.isSunk()).toBe(true);
  });

  test("ship is NOT sunk after less hits than its length", () => {
    carrier.hit();
    carrier.hit();
    carrier.hit();
    expect(carrier.isSunk()).toBe(false);
  });

  test("ship is sunk after more hits than its length", () => {
    carrier.hit();
    carrier.hit();
    carrier.hit();
    carrier.hit();
    carrier.hit();
    carrier.hit();
    expect(carrier.isSunk()).toBe(true);
  });
});

describe("gameboard class tests", () => {
  let gameboard;

  describe("placeShip tests", () => {
    beforeEach(() => {
      gameboard = new Gameboard();
    });

    test("place a carrier at A1 horizontally", () => {
      gameboard.placeShip("A", 1, "horizontal", "carrier");
      expect(gameboard.carrier.coordinates).toEqual([
        ["A", 1],
        ["A", 2],
        ["A", 3],
        ["A", 4],
        ["A", 5],
      ]);
    });

    test("place a carrier at C3 vertically", () => {
      gameboard.placeShip("C", 3, "vertical", "carrier");
      expect(gameboard.carrier.coordinates).toEqual([
        ["C", 3],
        ["D", 3],
        ["E", 3],
        ["F", 3],
        ["G", 3],
      ]);
    });

    test("place a destroyer at J10 vertically (should fail)", () => {
      let message = gameboard.placeShip("J", 10, "vertical", "destroyer");
      expect(message).toBe("Ships must be placed entirely on the board.");
    });

    test("place a destroyer at K(!)10 vertically (should fail)", () => {
      expect(gameboard.placeShip("K", 10, "vertical", "destroyer")).toBe(
        "Ships must be placed entirely on the board.",
      );
    });

    test("place a destroyer at A-10(!) vertically (should fail)", () => {
      expect(gameboard.placeShip("A", -10, "vertical", "destroyer")).toBe(
        "Ships must be placed entirely on the board.",
      );
    });

    test("place a cruiser at F4 horizontally", () => {
      gameboard.placeShip("F", 4, "horizontal", "cruiser");
      expect(gameboard.cruiser.coordinates).toEqual([
        ["F", 4],
        ["F", 5],
        ["F", 6],
      ]);
    });

    test("don't allow overlapping ships", () => {
      gameboard.placeShip("F", 4, "horizontal", "cruiser");
      expect(gameboard.placeShip("F", 3, "horizontal", "carrier")).toBe(
        "Ships cannot overlap.",
      );
    });

    test("remove ship", () => {
      gameboard.placeShip("F", 4, "horizontal", "cruiser");
      gameboard.removeShip("cruiser");
      expect(gameboard.cruiser.coordinates).toEqual([]);
    });
  });

  describe("receiveAttack tests", () => {
    beforeEach(() => {
      gameboard = new Gameboard();
      gameboard.placeShip("A", 1, "horizontal", "carrier");
      gameboard.placeShip("C", 3, "vertical", "cruiser");
    });

    test("tracks location of one hit", () => {
      gameboard.receiveAttack("A", 1);
      expect(gameboard.hits).toEqual([["A", 1]]);
    });

    test("tracks locations of multiple hits", () => {
      gameboard.receiveAttack("A", 1);
      gameboard.receiveAttack("D", 3);
      expect(gameboard.hits).toEqual([
        ["A", 1],
        ["D", 3],
      ]);
    });

    test("tracks location of misses", () => {
      gameboard.receiveAttack("G", 1);
      gameboard.receiveAttack("J", 3);
      expect(gameboard.misses).toEqual([
        ["G", 1],
        ["J", 3],
      ]);
    });
  });

  describe("allShipsSunk tests", () => {
    beforeEach(() => {
      gameboard = new Gameboard();
      gameboard.placeShip("A", 1, "horizontal", "carrier");
      gameboard.placeShip("C", 3, "vertical", "cruiser");
      gameboard.receiveAttack("A", 1);
      gameboard.receiveAttack("A", 2);
      gameboard.receiveAttack("A", 3);
      gameboard.receiveAttack("A", 4);
      gameboard.receiveAttack("A", 5);
      gameboard.receiveAttack("C", 3);
      gameboard.receiveAttack("D", 3);
    });

    test("reports false if not all ships are sunk", () => {
      expect(gameboard.allShipsSunk()).toBeFalsy();
    });

    test("reports true if all ships are sunk", () => {
      gameboard.receiveAttack("E", 3);
      expect(gameboard.allShipsSunk()).toBeTruthy();
    });
  });

  describe("miscellaneous gameboard methods", () => {
    let gameboard;

    beforeEach(() => {
      gameboard = new Gameboard();
    });

    test("listShipTypes returns correct array", () => {
      expect(gameboard.listShipTypes()).toEqual([
        "carrier",
        "battleship",
        "cruiser",
        "submarine",
        "destroyer",
      ]);
    });

    test("removeAllShips clears coordinates for all ships", () => {
      gameboard.placeShip("A", 1, "horizontal", "carrier");
      gameboard.placeShip("C", 3, "vertical", "cruiser");
      expect(gameboard.placedShips()).toBe(2);
      gameboard.removeAllShips();
      gameboard.listShipTypes().forEach((shipType) => {
        expect(gameboard[shipType].coordinates).toEqual([]);
      });
    });

    test("placedShips returns the number of placed ships", () => {
      expect(gameboard.placedShips()).toBe(0);
      gameboard.placeShip("A", 1, "horizontal", "carrier");
      gameboard.placeShip("C", 3, "vertical", "cruiser");
      expect(gameboard.placedShips()).toBe(2);
    });

    test("listShipLocations returns all coordinates of placed ships", () => {
      gameboard.placeShip("A", 1, "horizontal", "carrier");
      gameboard.placeShip("F", 4, "horizontal", "cruiser");
      expect(gameboard.listShipLocations()).toEqual([
        ["A", 1],
        ["A", 2],
        ["A", 3],
        ["A", 4],
        ["A", 5],
        ["F", 4],
        ["F", 5],
        ["F", 6],
      ]);
    });

    test("randomizeShips places all ships", () => {
      gameboard.randomizeShips();
      expect(gameboard.placedShips()).toBe(5);
    });
  });
});

describe("player class tests", () => {
  let player;

  describe("player tests", () => {
    beforeEach(() => {
      player = new Player("playerOne", "AI");
    });

    test("player exists", () => {
      expect(player).toBeTruthy();
    });

    test("AI attacks returns a valid coordinate", () => {
      const attackCoord = player.AIAttack();
      expect(attackCoord).toHaveLength(2);
      // Check coordinate format: letter, number
      expect(typeof attackCoord[0]).toBe("string");
      expect(typeof attackCoord[1]).toBe("number");
    });
  });
});
