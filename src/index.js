import "./style.css";
import { Player } from "./classes.js";
import { DOM } from "./DOM.js";

const playerOne = new Player("human");
const playerTwo = new Player("AI");

playerOne.gameboard.placeShip("A", 1, "horizontal", "carrier");
playerOne.gameboard.placeShip("B", 1, "horizontal", "battleship");
playerOne.gameboard.placeShip("C", 1, "horizontal", "cruiser");
playerOne.gameboard.placeShip("D", 1, "horizontal", "submarine");
playerOne.gameboard.placeShip("E", 1, "horizontal", "destroyer");

playerTwo.gameboard.placeShip("A", 1, "horizontal", "carrier");
playerTwo.gameboard.placeShip("B", 1, "horizontal", "battleship");
playerTwo.gameboard.placeShip("C", 1, "horizontal", "cruiser");
playerTwo.gameboard.placeShip("D", 1, "horizontal", "submarine");
playerTwo.gameboard.placeShip("E", 1, "horizontal", "destroyer");

DOM.renderBoard(playerOne, 1);
