import { Ship, Gameboard } from "./classes.js";

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

  test("ship is NOT sunk after less hits than it's length", () => {
    carrier.hit();
    carrier.hit();
    carrier.hit();
    expect(carrier.isSunk()).toBe(false);
  });

  test("ship is  sunk after more hits than it's length", () => {
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
  let playerOneGameboard;

  beforeEach(() => {
    playerOneGameboard = new Gameboard();
  });

  test("gameboard class exists", () => {
    expect(playerOneGameboard).toBeTruthy();
  });
});
