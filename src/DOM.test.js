import { DOM } from "./DOM.js";

describe("DOM class tests", () => {
  describe("combineCoordinates", () => {
    test("combines coordinate pairs into strings", () => {
      const input = [
        ["A", 1],
        ["B", 2],
        ["C", 10],
      ];
      const output = DOM.combineCoordinates(input);
      expect(output).toEqual(["A1", "B2", "C10"]);
    });
  });

  describe("splitCoordinates", () => {
    test("splits a coordinate string correctly", () => {
      expect(DOM.splitCoordinates("A1")).toEqual(["A", 1]);
      expect(DOM.splitCoordinates("C10")).toEqual(["C", 10]);
    });
  });

  describe("clearBoards", () => {
    beforeEach(() => {
      // Set up dummy gametile elements
      document.body.innerHTML = `
          <div class="gametile hit" data-coordinate="A1" style="cursor:pointer"></div>
          <div class="gametile hit" data-coordinate="A2" style="cursor:pointer"></div>
          <div class="gametile hit" data-coordinate="A3" style="cursor:pointer"></div>
        `;
      // Simulate bound event handlers
      document.querySelectorAll(".gametile").forEach((tile) => {
        tile.boundPlayerAttackFn = function () {};
      });
    });

    test("clearBoards resets all gametile elements", () => {
      DOM.clearBoards();
      const tiles = document.querySelectorAll(".gametile");
      tiles.forEach((tile) => {
        expect(tile.className).toBe("gametile");
        expect(tile.style.cursor).toBe("auto");
        expect(tile.boundPlayerAttackFn).toBeUndefined();
      });
    });
  });

  describe("renderHits", () => {
    beforeEach(() => {
      document.body.innerHTML = `
          <div class="playerOne">
            <div class="gametile" data-coordinate="A1"></div>
            <div class="gametile" data-coordinate="A2"></div>
            <div class="gametile" data-coordinate="A3"></div>
          </div>
        `;
    });

    test("adds 'hit' class to gametiles for each hit", () => {
      const player = {
        playerNumber: "playerOne",
        gameboard: {
          hits: [
            ["A", 1],
            ["A", 3],
          ],
        },
      };
      DOM.renderHits(player);
      const tileA1 = document.querySelector(`[data-coordinate="A1"]`);
      const tileA2 = document.querySelector(`[data-coordinate="A2"]`);
      const tileA3 = document.querySelector(`[data-coordinate="A3"]`);
      expect(tileA1.classList.contains("hit")).toBe(true);
      expect(tileA2.classList.contains("hit")).toBe(false);
      expect(tileA3.classList.contains("hit")).toBe(true);
    });
  });

  describe("renderMisses", () => {
    beforeEach(() => {
      document.body.innerHTML = `
          <div class="playerOne">
            <div class="gametile" data-coordinate="B1"></div>
            <div class="gametile" data-coordinate="B2"></div>
            <div class="gametile" data-coordinate="B3"></div>
          </div>
        `;
    });

    test("adds 'miss' class to gametiles for each miss", () => {
      const player = {
        playerNumber: "playerOne",
        gameboard: { misses: [["B", 2]] },
      };
      DOM.renderMisses(player);
      const tileB1 = document.querySelector(`[data-coordinate="B1"]`);
      const tileB2 = document.querySelector(`[data-coordinate="B2"]`);
      const tileB3 = document.querySelector(`[data-coordinate="B3"]`);
      expect(tileB1.classList.contains("miss")).toBe(false);
      expect(tileB2.classList.contains("miss")).toBe(true);
      expect(tileB3.classList.contains("miss")).toBe(false);
    });
  });

  describe("checkForWin", () => {
    test("returns true when player's gameboard allShipsSunk() is true", () => {
      const player = { gameboard: { allShipsSunk: () => true } };
      expect(DOM.checkForWin(player)).toBe(true);
    });

    test("returns false when player's gameboard allShipsSunk() is false", () => {
      const player = { gameboard: { allShipsSunk: () => false } };
      expect(DOM.checkForWin(player)).toBe(false);
    });
  });

  describe("computersTurn", () => {
    test("calls receiveAttack on human player with computer's attack coordinate", () => {
      const fakeCoord = ["D", 4];
      const humanPlayer = {
        gameboard: {
          receiveAttack: jest.fn(),
          allShipsSunk: () => false,
          hits: [],
          misses: [],
        },
      };
      const computerPlayer = {
        AIAttack: jest.fn(() => fakeCoord),
      };
      DOM.computersTurn(humanPlayer, computerPlayer);
      expect(humanPlayer.gameboard.receiveAttack).toHaveBeenCalledWith("D", 4);
    });
  });
});
