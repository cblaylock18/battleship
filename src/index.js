import "./style.css";
import { Player } from "./classes.js";
import { DOM } from "./DOM.js";

const playerOne = new Player("playerOne", "human");
const playerTwo = new Player("playerTwo", "AI");

playerOne.gameboard.placeShip("A", 1, "horizontal", "carrier");
playerOne.gameboard.placeShip("B", 1, "horizontal", "battleship");
playerOne.gameboard.placeShip("C", 1, "horizontal", "cruiser");
playerOne.gameboard.placeShip("D", 1, "horizontal", "submarine");
playerOne.gameboard.placeShip("E", 1, "horizontal", "destroyer");

playerTwo.gameboard.placeShip("A", 5, "vertical", "carrier");
playerTwo.gameboard.placeShip("I", 1, "horizontal", "battleship");
playerTwo.gameboard.placeShip("F", 8, "vertical", "cruiser");
playerTwo.gameboard.placeShip("H", 10, "vertical", "submarine");
playerTwo.gameboard.placeShip("E", 1, "horizontal", "destroyer");

// DOM.preGame()
DOM.renderPlayerBoards(playerOne, playerTwo);

// PC vs computer
// state: PC board is always visible
// state: computer board is never visible
// alternating state: player picks a spot to attack, attacks, check for win, then computer turn
// computer attacks, check for win, then pc attacks
