import "./style.css";
import { Player } from "./classes.js";
import { DOM } from "./DOM.js";

const playerOne = new Player("playerOne", "human");
const playerTwo = new Player("playerTwo", "AI");

DOM.preGame(playerOne, playerTwo);

// PC vs computer
// state: PC board is always visible
// state: computer board is never visible
// alternating state: player picks a spot to attack, attacks, check for win, then computer turn
// computer attacks, check for win, then pc attacks
