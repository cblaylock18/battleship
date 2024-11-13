/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/DOM.js":
/*!********************!*\
  !*** ./src/DOM.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DOM: () => (/* binding */ DOM)
/* harmony export */ });
class DOM {
  static playerAttackFn(attackingPlayer, defendingPlayer, event) {
    const defendingBoard = document.querySelector(`.${defendingPlayer.playerNumber}`);
    const gametile = event.target;
    const coordinateArray = DOM.splitCoordinates(gametile.dataset.coordinate);
    defendingPlayer.gameboard.receiveAttack(coordinateArray[0], coordinateArray[1]);
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
    const defendingBoard = document.querySelector(`.${defendingPlayer.playerNumber}`);
    const defendingTiles = Array.from(defendingBoard.querySelectorAll(".gametile"));
    const boundPlayerAttackFn = this.playerAttackFn.bind(this, attackingPlayer, defendingPlayer);
    defendingTiles.forEach(gametile => {
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
    shipLocations.forEach(shipLocation => {
      const gridCell = board.querySelector(`[data-coordinate="${shipLocation[0]}"]`);
      gridCell.classList.add(`${shipLocation[1]}`);
    });
  }
  static renderHits(player) {
    const board = document.querySelector(`.${player.playerNumber}`);
    const hits = this.combineCoordinates(player.gameboard.hits);
    hits.forEach(hit => {
      const gridCell = board.querySelector(`[data-coordinate="${hit}"]`);
      gridCell.classList.add("hit");
    });
  }
  static renderMisses(player) {
    const board = document.querySelector(`.${player.playerNumber}`);
    const misses = this.combineCoordinates(player.gameboard.misses);
    misses.forEach(miss => {
      const gridCell = board.querySelector(`[data-coordinate="${miss}"]`);
      gridCell.classList.add("miss");
    });
  }
  static computersTurn(humanPlayer, computerPlayer) {
    const computersAttackCoordinates = computerPlayer.AIAttack();
    humanPlayer.gameboard.receiveAttack(computersAttackCoordinates[0], computersAttackCoordinates[1] * 1);
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
    const placeShipsFn = event => {
      playerOne.gameboard.removeAllShips();
      DOM.clearBoards();
      let error = false;
      event.preventDefault();
      if (!playGameForm.checkValidity()) {
        playGameForm.reportValidity();
      } else {
        shipTypes.forEach(ship => {
          const coordinateInput = playGameForm.querySelector(`#${ship}-coordinates`);
          const orientationInput = playGameForm.querySelector(`#${ship}-orientation`);
          const errorSpan = playGameForm.querySelector(`.${ship}-error-span`);
          const rawCoordinates = coordinateInput.value;
          const updatedCoordinates = DOM.splitCoordinates(rawCoordinates);
          const orientation = orientationInput.value;
          errorSpan.textContent = "";
          const shipPlacementWorked = playerOne.gameboard.placeShip(updatedCoordinates[0], updatedCoordinates[1], orientation, ship);
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
    shipTypes.forEach(ship => {
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
    gameTiles.forEach(gametile => {
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
    array.forEach(coordinatePair => {
      newArray.push(coordinatePair[0] + coordinatePair[1]);
    });
    return newArray;
  }
  static splitCoordinates(coordinate) {
    return [coordinate.at(0), coordinate.slice(1) * 1];
  }
}


/***/ }),

/***/ "./src/classes.js":
/*!************************!*\
  !*** ./src/classes.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Gameboard: () => (/* binding */ Gameboard),
/* harmony export */   Player: () => (/* binding */ Player),
/* harmony export */   Ship: () => (/* binding */ Ship)
/* harmony export */ });
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
      coordinates: []
    };
    this.battleship = {
      ship: new Ship(4),
      coordinates: []
    };
    this.cruiser = {
      ship: new Ship(3),
      coordinates: []
    };
    this.submarine = {
      ship: new Ship(3),
      coordinates: []
    };
    this.destroyer = {
      ship: new Ship(2),
      coordinates: []
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
    if (orientation === "horizontal" && shipLength + numberCoordinate > 11 || orientation === "vertical" && shipLength + letterIndex > 10 || letterIndex === -1 || numberCoordinate < 1 || numberCoordinate > 10) {
      error = "Ships must be placed entirely on the board.";
      placeShip = false;
    }
    for (let i = 0; i < shipLength; i++) {
      if (orientation === "horizontal") {
        shipCoordinates.push([uppercaseLetterCoordinate, numberCoordinate + i]);
      } else if (orientation === "vertical") {
        shipCoordinates.push([allowedLetters[letterIndex + i], numberCoordinate]);
      }
    }
    shipCoordinates.forEach(newCoordinate => {
      existingCoordinates.forEach(oldCoordinate => {
        if (newCoordinate[0] === oldCoordinate[0] && newCoordinate[1] === oldCoordinate[1]) {
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
    shipTypes.forEach(ship => {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 500;
      let coordinates = {
        horizontal: this.gameboardCoordinates(),
        vertical: this.gameboardCoordinates()
      };
      while (!placed && attempts <= maxAttempts) {
        const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
        const randomIndex = Math.floor(Math.random() * coordinates[orientation].length);
        const randomCoordinate = coordinates[orientation][randomIndex];
        const shipPlacementWorked = this.placeShip(randomCoordinate[0], randomCoordinate[1], orientation, ship);
        if (shipPlacementWorked !== "placed") {
          coordinates[orientation].splice(randomIndex, 1);
          // try again
        } else {
          placed = true;
        }
        attempts++;
      }
      console.log(this[ship].coordinates);
    });
  }
  removeShip(ship) {
    this[ship].coordinates = [];
  }
  removeAllShips() {
    const shipTypes = this.listShipTypes();
    shipTypes.forEach(ship => {
      this.removeShip(ship);
    });
  }
  receiveAttack(letterCoordinate, numberCoordinate) {
    const shipTypes = this.listShipTypes();
    let hit = false;
    shipTypes.forEach(ship => {
      this[ship].coordinates.forEach(coordinate => {
        if (coordinate[0] === letterCoordinate && coordinate[1] === numberCoordinate) {
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
    this.listShipTypes().forEach(ship => {
      shipLocations = shipLocations.concat(this[ship].coordinates);
    });
    return shipLocations;
  }
  listGridCellsWithAssociatedShip() {
    let shipLocations = [];
    this.listShipTypes().forEach(ship => {
      if (this[ship].coordinates.length === 0) {}
      const length = this[ship].ship.length;
      for (let i = 0; i < length; i++) {
        if (this[ship].coordinates.length === 0) {} else {
          shipLocations.push([[this[ship].coordinates[i][0] + this[ship].coordinates[i][1]], ship]);
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
    allShipTypes.forEach(shipType => {
      if (this[shipType].coordinates.length > 0) {
        placedShips++;
      }
    });
    return placedShips;
  }
  allShipsPlaced() {
    return this.placedShips = 5;
  }
  allShipsSunk() {
    let numberOfSunkenShips = 0;
    const allShipTypes = this.listShipTypes();
    allShipTypes.forEach(shipType => {
      if (this[shipType].ship.isSunk()) {
        numberOfSunkenShips++;
      }
    });
    return numberOfSunkenShips === 5;
    // once game is fully implemented and players must start out with 5 ships, could reduce this logic to check if 5 ships are sunk
  }
  gameboardCoordinates() {
    return [["A", 1], ["A", 2], ["A", 3], ["A", 4], ["A", 5], ["A", 6], ["A", 7], ["A", 8], ["A", 9], ["A", 10], ["B", 1], ["B", 2], ["B", 3], ["B", 4], ["B", 5], ["B", 6], ["B", 7], ["B", 8], ["B", 9], ["B", 10], ["C", 1], ["C", 2], ["C", 3], ["C", 4], ["C", 5], ["C", 6], ["C", 7], ["C", 8], ["C", 9], ["C", 10], ["D", 1], ["D", 2], ["D", 3], ["D", 4], ["D", 5], ["D", 6], ["D", 7], ["D", 8], ["D", 9], ["D", 10], ["E", 1], ["E", 2], ["E", 3], ["E", 4], ["E", 5], ["E", 6], ["E", 7], ["E", 8], ["E", 9], ["E", 10], ["F", 1], ["F", 2], ["F", 3], ["F", 4], ["F", 5], ["F", 6], ["F", 7], ["F", 8], ["F", 9], ["F", 10], ["G", 1], ["G", 2], ["G", 3], ["G", 4], ["G", 5], ["G", 6], ["G", 7], ["G", 8], ["G", 9], ["G", 10], ["H", 1], ["H", 2], ["H", 3], ["H", 4], ["H", 5], ["H", 6], ["H", 7], ["H", 8], ["H", 9], ["H", 10], ["I", 1], ["I", 2], ["I", 3], ["I", 4], ["I", 5], ["I", 6], ["I", 7], ["I", 8], ["I", 9], ["I", 10], ["J", 1], ["J", 2], ["J", 3], ["J", 4], ["J", 5], ["J", 6], ["J", 7], ["J", 8], ["J", 9], ["J", 10]];
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


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}

body {
  font-family: monospace;
  display: flex;
  flex-direction: column;
}

header {
  background-image: linear-gradient(#052f5f, #005377);
  color: white;
  font-size: 4rem;
  padding: 1rem;
  text-align: center;
  font-weight: bolder;
}

header > span {
  position: relative;
  display: inline-block;
}

@keyframes oscillate {
  from {
    transform: translateX(-50%) scale(0);
    opacity: 0.3;
  }
  to {
    transform: translateX(-50%) scale(1);
    opacity: 0.8;
  }
}

.explosion {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  animation: oscillate 1.75s infinite alternate;
  z-index: 1;
}

.form-container {
  padding: 15px;
  background-image: linear-gradient(#0053773b, #f1a308b0);
}

.form-header {
  font-size: 2rem;
  padding: 8px;
  font-weight: bolder;
  text-align: center;
  color: #740800;
  text-decoration: underline;
}

form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 15px;
  align-items: center;
  font-size: 1.5rem;
}

form > div {
  flex: 0 1 440px;
  display: grid;
  padding: 4px;
  gap: 10px;
  grid-template-rows: 1fr 1fr 20px;
  place-items: center;
  padding-right: 10px;
  border-right: 1px grey dotted;
  border-bottom: 1px grey dotted;
}

.carrier-container {
  color: rgba(0, 0, 0, 0.747);
}

.battleship-container {
  color: rgba(0, 87, 4, 0.747);
}

.cruiser-container {
  color: rgba(199, 0, 0, 0.747);
}

.submarine-container {
  color: rgba(17, 0, 173, 0.747);
}

.destroyer-container {
  color: rgba(126, 0, 119, 0.747);
}

form > div > div {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: left;
  padding-right: 10px;
  grid-area: 1 / 1 / 2 / 2;
}

select {
  width: min-content;
  justify-self: end;
  font-size: 1rem;
  padding: 4px;
  border-radius: 4px;
  grid-area: 1 / 2 / 2 / 4;
}

label {
  font-size: 1rem;
  justify-self: end;
  grid-area: 2 / 2 / 3 / 3;
}

input[type="text"] {
  padding: 4px;
  width: 40px;
  font-size: 1rem;
  justify-self: end;
  border-radius: 4px;
  grid-area: 2 / 3 / 3 / 4;
}

.error {
  font-size: 16px;
  color: red;
  grid-area: 3 / 1 / 4 / 4;
}

.buttons {
  width: 400px;
  height: min-content;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  border: none;
}

#play-game-btn,
#reset-game-btn {
  padding: 10px 20px;
  font-weight: bolder;
  font-size: 2rem;
  border: 1px black solid;
  border-radius: 15px;
  cursor: pointer;
  margin: 5px;
  transition: background-color 0.3s ease;
}

#play-game-btn {
  background-color: #052f5f;
  color: white;
}

#play-game-btn:hover {
  background-color: #005377;
}

#reset-game-btn {
  background-color: #f44336;
  color: white;
}

#reset-game-btn:hover {
  background-color: #da190b;
}

#play-game-btn:active,
#reset-game-btn:active {
  transform: scale(0.95);
}

.gameboards {
  margin-top: 25px;
  width: 100%;
  height: min-content;
  display: flex;
  column-gap: 10vw;
  row-gap: 25px;
  justify-content: center;
  flex-wrap: wrap;
}

.gameboard {
  display: grid;
  gap: 0px;
  grid-template-columns: repeat(11, 32px);
  grid-template-rows: repeat(11, 32px);
  justify-content: center;
  margin-bottom: 24px;
}

.column-number,
.row-letter {
  text-align: center;
  font-size: 20px;
  align-self: center;
}

.gametile {
  width: 32px;
  height: 32px;
  border: 1px solid black;
  position: relative;
  box-sizing: border-box;
  background-color: #06a77d;
}

@media only screen and (min-width: 768px) {
  .gameboard {
    grid-template-columns: repeat(11, 56px);
    grid-template-rows: repeat(11, 56px);
  }

  .column-number,
  .row-letter {
    font-size: 30px;
  }

  .gametile {
    width: 56px;
    height: 56px;
  }
}

.carrier,
.battleship,
.cruiser,
.submarine,
.destroyer {
  border: 1px solid grey;
}

.carrier {
  background-color: rgba(0, 0, 0, 0.747);
}

.battleship {
  background-color: rgba(0, 87, 4, 0.747);
}

.cruiser {
  background-color: rgba(199, 0, 0, 0.747);
}

.submarine {
  background-color: rgba(17, 0, 173, 0.747);
}

.destroyer {
  background-color: rgba(126, 0, 119, 0.747);
}

.hit::after {
  position: absolute;
  content: "🎯";
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  pointer-events: none;
}

.miss::after {
  position: absolute;
  content: "⭕";
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  pointer-events: none;
}

.miss,
.hit {
  cursor: auto;
}
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["html,\nbody,\ndiv,\nspan,\napplet,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\nsmall,\nstrike,\nstrong,\nsub,\nsup,\ntt,\nvar,\nb,\nu,\ni,\ncenter,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\narticle,\naside,\ncanvas,\ndetails,\nembed,\nfigure,\nfigcaption,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\noutput,\nruby,\nsection,\nsummary,\ntime,\nmark,\naudio,\nvideo {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline;\n}\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection {\n  display: block;\n}\nbody {\n  line-height: 1;\n}\nol,\nul {\n  list-style: none;\n}\nblockquote,\nq {\n  quotes: none;\n}\nblockquote:before,\nblockquote:after,\nq:before,\nq:after {\n  content: \"\";\n  content: none;\n}\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\nbody {\n  font-family: monospace;\n  display: flex;\n  flex-direction: column;\n}\n\nheader {\n  background-image: linear-gradient(#052f5f, #005377);\n  color: white;\n  font-size: 4rem;\n  padding: 1rem;\n  text-align: center;\n  font-weight: bolder;\n}\n\nheader > span {\n  position: relative;\n  display: inline-block;\n}\n\n@keyframes oscillate {\n  from {\n    transform: translateX(-50%) scale(0);\n    opacity: 0.3;\n  }\n  to {\n    transform: translateX(-50%) scale(1);\n    opacity: 0.8;\n  }\n}\n\n.explosion {\n  position: absolute;\n  top: 0;\n  left: 50%;\n  transform: translateX(-50%);\n  animation: oscillate 1.75s infinite alternate;\n  z-index: 1;\n}\n\n.form-container {\n  padding: 15px;\n  background-image: linear-gradient(#0053773b, #f1a308b0);\n}\n\n.form-header {\n  font-size: 2rem;\n  padding: 8px;\n  font-weight: bolder;\n  text-align: center;\n  color: #740800;\n  text-decoration: underline;\n}\n\nform {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 15px;\n  padding: 15px;\n  align-items: center;\n  font-size: 1.5rem;\n}\n\nform > div {\n  flex: 0 1 440px;\n  display: grid;\n  padding: 4px;\n  gap: 10px;\n  grid-template-rows: 1fr 1fr 20px;\n  place-items: center;\n  padding-right: 10px;\n  border-right: 1px grey dotted;\n  border-bottom: 1px grey dotted;\n}\n\n.carrier-container {\n  color: rgba(0, 0, 0, 0.747);\n}\n\n.battleship-container {\n  color: rgba(0, 87, 4, 0.747);\n}\n\n.cruiser-container {\n  color: rgba(199, 0, 0, 0.747);\n}\n\n.submarine-container {\n  color: rgba(17, 0, 173, 0.747);\n}\n\n.destroyer-container {\n  color: rgba(126, 0, 119, 0.747);\n}\n\nform > div > div {\n  font-size: 1.8rem;\n  font-weight: bold;\n  text-align: left;\n  padding-right: 10px;\n  grid-area: 1 / 1 / 2 / 2;\n}\n\nselect {\n  width: min-content;\n  justify-self: end;\n  font-size: 1rem;\n  padding: 4px;\n  border-radius: 4px;\n  grid-area: 1 / 2 / 2 / 4;\n}\n\nlabel {\n  font-size: 1rem;\n  justify-self: end;\n  grid-area: 2 / 2 / 3 / 3;\n}\n\ninput[type=\"text\"] {\n  padding: 4px;\n  width: 40px;\n  font-size: 1rem;\n  justify-self: end;\n  border-radius: 4px;\n  grid-area: 2 / 3 / 3 / 4;\n}\n\n.error {\n  font-size: 16px;\n  color: red;\n  grid-area: 3 / 1 / 4 / 4;\n}\n\n.buttons {\n  width: 400px;\n  height: min-content;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-around;\n  border: none;\n}\n\n#play-game-btn,\n#reset-game-btn {\n  padding: 10px 20px;\n  font-weight: bolder;\n  font-size: 2rem;\n  border: 1px black solid;\n  border-radius: 15px;\n  cursor: pointer;\n  margin: 5px;\n  transition: background-color 0.3s ease;\n}\n\n#play-game-btn {\n  background-color: #052f5f;\n  color: white;\n}\n\n#play-game-btn:hover {\n  background-color: #005377;\n}\n\n#reset-game-btn {\n  background-color: #f44336;\n  color: white;\n}\n\n#reset-game-btn:hover {\n  background-color: #da190b;\n}\n\n#play-game-btn:active,\n#reset-game-btn:active {\n  transform: scale(0.95);\n}\n\n.gameboards {\n  margin-top: 25px;\n  width: 100%;\n  height: min-content;\n  display: flex;\n  column-gap: 10vw;\n  row-gap: 25px;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n\n.gameboard {\n  display: grid;\n  gap: 0px;\n  grid-template-columns: repeat(11, 32px);\n  grid-template-rows: repeat(11, 32px);\n  justify-content: center;\n  margin-bottom: 24px;\n}\n\n.column-number,\n.row-letter {\n  text-align: center;\n  font-size: 20px;\n  align-self: center;\n}\n\n.gametile {\n  width: 32px;\n  height: 32px;\n  border: 1px solid black;\n  position: relative;\n  box-sizing: border-box;\n  background-color: #06a77d;\n}\n\n@media only screen and (min-width: 768px) {\n  .gameboard {\n    grid-template-columns: repeat(11, 56px);\n    grid-template-rows: repeat(11, 56px);\n  }\n\n  .column-number,\n  .row-letter {\n    font-size: 30px;\n  }\n\n  .gametile {\n    width: 56px;\n    height: 56px;\n  }\n}\n\n.carrier,\n.battleship,\n.cruiser,\n.submarine,\n.destroyer {\n  border: 1px solid grey;\n}\n\n.carrier {\n  background-color: rgba(0, 0, 0, 0.747);\n}\n\n.battleship {\n  background-color: rgba(0, 87, 4, 0.747);\n}\n\n.cruiser {\n  background-color: rgba(199, 0, 0, 0.747);\n}\n\n.submarine {\n  background-color: rgba(17, 0, 173, 0.747);\n}\n\n.destroyer {\n  background-color: rgba(126, 0, 119, 0.747);\n}\n\n.hit::after {\n  position: absolute;\n  content: \"🎯\";\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 24px;\n  pointer-events: none;\n}\n\n.miss::after {\n  position: absolute;\n  content: \"⭕\";\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 24px;\n  pointer-events: none;\n}\n\n.miss,\n.hit {\n  cursor: auto;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _classes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classes.js */ "./src/classes.js");
/* harmony import */ var _DOM_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DOM.js */ "./src/DOM.js");



const playerOne = new _classes_js__WEBPACK_IMPORTED_MODULE_1__.Player("playerOne", "human");
const playerTwo = new _classes_js__WEBPACK_IMPORTED_MODULE_1__.Player("playerTwo", "AI");
_DOM_js__WEBPACK_IMPORTED_MODULE_2__.DOM.preGame(playerOne, playerTwo);

// PC vs computer
// state: PC board is always visible
// state: computer board is never visible
// alternating state: player picks a spot to attack, attacks, check for win, then computer turn
// computer attacks, check for win, then pc attacks
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBRVQsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBRVQsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBRVQsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBRVQsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBRVQsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBRVQsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBRVQsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBRVQsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBRVQsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQ1Y7RUFDSDtBQUNGO0FBRUEsTUFBTWdCLE1BQU0sQ0FBQztFQUNYN0MsV0FBV0EsQ0FBQzFELE1BQU0sRUFBRXdHLElBQUksRUFBRTtJQUN4QixJQUFJLENBQUN6SSxZQUFZLEdBQUdpQyxNQUFNO0lBQzFCLElBQUksQ0FBQ3dHLElBQUksR0FBR0EsSUFBSTtJQUNoQixJQUFJLENBQUNsSSxTQUFTLEdBQUcsSUFBSXdGLFNBQVMsQ0FBQyxDQUFDO0lBQ2hDLElBQUksQ0FBQzJDLGVBQWUsR0FBRyxJQUFJLENBQUNuSSxTQUFTLENBQUNpSCxvQkFBb0IsQ0FBQyxDQUFDO0VBQzlEO0VBRUF2RSxRQUFRQSxDQUFBLEVBQUc7SUFDVCxNQUFNMkUsV0FBVyxHQUFHRixJQUFJLENBQUNHLEtBQUssQ0FBQ0gsSUFBSSxDQUFDQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQ2UsZUFBZSxDQUFDOUMsTUFBTSxDQUFDO0lBQzNFLE1BQU1rQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUNZLGVBQWUsQ0FBQ2QsV0FBVyxDQUFDO0lBQzFELElBQUksQ0FBQ2MsZUFBZSxDQUFDWCxNQUFNLENBQUNILFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDM0MsT0FBT0UsZ0JBQWdCO0VBQ3pCO0VBRUE1QyxLQUFLQSxDQUFBLEVBQUc7SUFDTixJQUFJLENBQUMzRSxTQUFTLEdBQUcsSUFBSXdGLFNBQVMsQ0FBQyxDQUFDO0lBQ2hDLElBQUksQ0FBQzJDLGVBQWUsR0FBRyxJQUFJLENBQUNuSSxTQUFTLENBQUNpSCxvQkFBb0IsQ0FBQyxDQUFDO0VBQzlEO0FBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyWUE7QUFDMEc7QUFDakI7QUFDekYsOEJBQThCLG1GQUEyQixDQUFDLDRGQUFxQztBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxnS0FBZ0ssV0FBVyxVQUFVLFVBQVUsVUFBVSxVQUFVLFlBQVksTUFBTSxlQUFlLFVBQVUsTUFBTSxLQUFLLFVBQVUsTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLFVBQVUsS0FBSyxRQUFRLFVBQVUsVUFBVSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssS0FBSyxZQUFZLFdBQVcsS0FBSyxLQUFLLFlBQVksV0FBVyxLQUFLLE1BQU0sS0FBSyxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxXQUFXLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxV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QTtBQUNBOzs7Ozs7VUNiQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7Ozs7Ozs7Ozs7QUNBcUI7QUFDaUI7QUFDUDtBQUUvQixNQUFNMUYsU0FBUyxHQUFHLElBQUkwRywrQ0FBTSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUM7QUFDbEQsTUFBTXpHLFNBQVMsR0FBRyxJQUFJeUcsK0NBQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDO0FBRS9DaEosd0NBQUcsQ0FBQzJELE9BQU8sQ0FBQ3JCLFNBQVMsRUFBRUMsU0FBUyxDQUFDOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL3NyYy9ET00uanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL3NyYy9jbGFzc2VzLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3RlbXBsYXRlLTEvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RlbXBsYXRlLTEvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBET00ge1xuICBzdGF0aWMgcGxheWVyQXR0YWNrRm4oYXR0YWNraW5nUGxheWVyLCBkZWZlbmRpbmdQbGF5ZXIsIGV2ZW50KSB7XG4gICAgY29uc3QgZGVmZW5kaW5nQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgYC4ke2RlZmVuZGluZ1BsYXllci5wbGF5ZXJOdW1iZXJ9YCxcbiAgICApO1xuICAgIGNvbnN0IGdhbWV0aWxlID0gZXZlbnQudGFyZ2V0O1xuICAgIGNvbnN0IGNvb3JkaW5hdGVBcnJheSA9IERPTS5zcGxpdENvb3JkaW5hdGVzKGdhbWV0aWxlLmRhdGFzZXQuY29vcmRpbmF0ZSk7XG5cbiAgICBkZWZlbmRpbmdQbGF5ZXIuZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soXG4gICAgICBjb29yZGluYXRlQXJyYXlbMF0sXG4gICAgICBjb29yZGluYXRlQXJyYXlbMV0sXG4gICAgKTtcbiAgICBET00ucmVuZGVySGl0cyhkZWZlbmRpbmdQbGF5ZXIpO1xuICAgIERPTS5yZW5kZXJNaXNzZXMoZGVmZW5kaW5nUGxheWVyKTtcblxuICAgIGlmIChET00uY2hlY2tGb3JXaW4oZGVmZW5kaW5nUGxheWVyKSkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFsZXJ0KFwiWW91IHdpbiEhXCIpO1xuICAgICAgfSwgMCk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZXNldC1nYW1lLWJ0blwiKS5jbGljaygpO1xuICAgICAgfSwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdhbWV0aWxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBnYW1ldGlsZS5ib3VuZFBsYXllckF0dGFja0ZuKTtcbiAgICAgIGRlbGV0ZSBnYW1ldGlsZS5ib3VuZFBsYXllckF0dGFja0ZuOyAvL1xuICAgICAgZ2FtZXRpbGUuc3R5bGUuY3Vyc29yID0gXCJhdXRvXCI7XG4gICAgICBkZWZlbmRpbmdCb2FyZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICBET00uY29tcHV0ZXJzVHVybihhdHRhY2tpbmdQbGF5ZXIsIGRlZmVuZGluZ1BsYXllcik7XG4gICAgICBkZWZlbmRpbmdCb2FyZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhdXRvXCI7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHByZXBCb2FyZEZvckF0dGFja0NsaWNrRXZlbnRzKGF0dGFja2luZ1BsYXllciwgZGVmZW5kaW5nUGxheWVyKSB7XG4gICAgY29uc3QgZGVmZW5kaW5nQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgYC4ke2RlZmVuZGluZ1BsYXllci5wbGF5ZXJOdW1iZXJ9YCxcbiAgICApO1xuICAgIGNvbnN0IGRlZmVuZGluZ1RpbGVzID0gQXJyYXkuZnJvbShcbiAgICAgIGRlZmVuZGluZ0JvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZXRpbGVcIiksXG4gICAgKTtcblxuICAgIGNvbnN0IGJvdW5kUGxheWVyQXR0YWNrRm4gPSB0aGlzLnBsYXllckF0dGFja0ZuLmJpbmQoXG4gICAgICB0aGlzLFxuICAgICAgYXR0YWNraW5nUGxheWVyLFxuICAgICAgZGVmZW5kaW5nUGxheWVyLFxuICAgICk7XG5cbiAgICBkZWZlbmRpbmdUaWxlcy5mb3JFYWNoKChnYW1ldGlsZSkgPT4ge1xuICAgICAgZ2FtZXRpbGUuc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG4gICAgICBnYW1ldGlsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYm91bmRQbGF5ZXJBdHRhY2tGbik7XG4gICAgICBnYW1ldGlsZS5ib3VuZFBsYXllckF0dGFja0ZuID0gYm91bmRQbGF5ZXJBdHRhY2tGbjtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyByZW5kZXJQbGF5ZXJCb2FyZHMocGxheWVyT25lLCBwbGF5ZXJUd28pIHtcbiAgICB0aGlzLnJlbmRlclNoaXBzKHBsYXllck9uZSk7XG4gICAgdGhpcy5yZW5kZXJIaXRzKHBsYXllck9uZSk7XG4gICAgdGhpcy5yZW5kZXJNaXNzZXMocGxheWVyT25lKTtcblxuICAgIHRoaXMucmVuZGVySGl0cyhwbGF5ZXJUd28pO1xuICAgIHRoaXMucmVuZGVyTWlzc2VzKHBsYXllclR3byk7XG4gICAgdGhpcy5wcmVwQm9hcmRGb3JBdHRhY2tDbGlja0V2ZW50cyhwbGF5ZXJPbmUsIHBsYXllclR3byk7XG4gIH1cblxuICBzdGF0aWMgcmVuZGVyU2hpcHMocGxheWVyKSB7XG4gICAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtwbGF5ZXIucGxheWVyTnVtYmVyfWApO1xuICAgIGNvbnN0IHNoaXBMb2NhdGlvbnMgPSBwbGF5ZXIuZ2FtZWJvYXJkLmxpc3RHcmlkQ2VsbHNXaXRoQXNzb2NpYXRlZFNoaXAoKTtcblxuICAgIHNoaXBMb2NhdGlvbnMuZm9yRWFjaCgoc2hpcExvY2F0aW9uKSA9PiB7XG4gICAgICBjb25zdCBncmlkQ2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS1jb29yZGluYXRlPVwiJHtzaGlwTG9jYXRpb25bMF19XCJdYCxcbiAgICAgICk7XG4gICAgICBncmlkQ2VsbC5jbGFzc0xpc3QuYWRkKGAke3NoaXBMb2NhdGlvblsxXX1gKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyByZW5kZXJIaXRzKHBsYXllcikge1xuICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7cGxheWVyLnBsYXllck51bWJlcn1gKTtcbiAgICBjb25zdCBoaXRzID0gdGhpcy5jb21iaW5lQ29vcmRpbmF0ZXMocGxheWVyLmdhbWVib2FyZC5oaXRzKTtcblxuICAgIGhpdHMuZm9yRWFjaCgoaGl0KSA9PiB7XG4gICAgICBjb25zdCBncmlkQ2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvb3JkaW5hdGU9XCIke2hpdH1cIl1gKTtcblxuICAgICAgZ3JpZENlbGwuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyByZW5kZXJNaXNzZXMocGxheWVyKSB7XG4gICAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtwbGF5ZXIucGxheWVyTnVtYmVyfWApO1xuICAgIGNvbnN0IG1pc3NlcyA9IHRoaXMuY29tYmluZUNvb3JkaW5hdGVzKHBsYXllci5nYW1lYm9hcmQubWlzc2VzKTtcblxuICAgIG1pc3Nlcy5mb3JFYWNoKChtaXNzKSA9PiB7XG4gICAgICBjb25zdCBncmlkQ2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvb3JkaW5hdGU9XCIke21pc3N9XCJdYCk7XG5cbiAgICAgIGdyaWRDZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGNvbXB1dGVyc1R1cm4oaHVtYW5QbGF5ZXIsIGNvbXB1dGVyUGxheWVyKSB7XG4gICAgY29uc3QgY29tcHV0ZXJzQXR0YWNrQ29vcmRpbmF0ZXMgPSBjb21wdXRlclBsYXllci5BSUF0dGFjaygpO1xuXG4gICAgaHVtYW5QbGF5ZXIuZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soXG4gICAgICBjb21wdXRlcnNBdHRhY2tDb29yZGluYXRlc1swXSxcbiAgICAgIGNvbXB1dGVyc0F0dGFja0Nvb3JkaW5hdGVzWzFdICogMSxcbiAgICApO1xuICAgIHRoaXMucmVuZGVySGl0cyhodW1hblBsYXllcik7XG4gICAgdGhpcy5yZW5kZXJNaXNzZXMoaHVtYW5QbGF5ZXIpO1xuICAgIGlmICh0aGlzLmNoZWNrRm9yV2luKGh1bWFuUGxheWVyKSkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFsZXJ0KFwiQmV0dGVyIGx1Y2sgbmV4dCB0aW1lIVwiKTtcbiAgICAgIH0sIDApO1xuICAgICAgLy8gY2xlYXIgYm9hcmQgYW5kIHJlc2V0IGdhbWUgZnVuY3Rpb24gIzIvMlxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBjaGVja0ZvcldpbihwbGF5ZXIpIHtcbiAgICBpZiAocGxheWVyLmdhbWVib2FyZC5hbGxTaGlwc1N1bmsoKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0YXRpYyBwcmVHYW1lKHBsYXllck9uZSwgcGxheWVyVHdvKSB7XG4gICAgY29uc3QgcGxheUdhbWVGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGF5ZXItb25lLWZvcm1cIik7XG4gICAgY29uc3QgcGxheUJ0biA9IHBsYXlHYW1lRm9ybS5xdWVyeVNlbGVjdG9yKFwiI3BsYXktZ2FtZS1idG5cIik7XG4gICAgY29uc3QgcmVzZXRCdG4gPSBwbGF5R2FtZUZvcm0ucXVlcnlTZWxlY3RvcihcIiNyZXNldC1nYW1lLWJ0blwiKTtcblxuICAgIGNvbnN0IHNoaXBUeXBlcyA9IHBsYXllck9uZS5nYW1lYm9hcmQubGlzdFNoaXBUeXBlcygpO1xuXG4gICAgY29uc3QgcGxhY2VTaGlwc0ZuID0gKGV2ZW50KSA9PiB7XG4gICAgICBwbGF5ZXJPbmUuZ2FtZWJvYXJkLnJlbW92ZUFsbFNoaXBzKCk7XG4gICAgICBET00uY2xlYXJCb2FyZHMoKTtcbiAgICAgIGxldCBlcnJvciA9IGZhbHNlO1xuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKCFwbGF5R2FtZUZvcm0uY2hlY2tWYWxpZGl0eSgpKSB7XG4gICAgICAgIHBsYXlHYW1lRm9ybS5yZXBvcnRWYWxpZGl0eSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcFR5cGVzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgICBjb25zdCBjb29yZGluYXRlSW5wdXQgPSBwbGF5R2FtZUZvcm0ucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIGAjJHtzaGlwfS1jb29yZGluYXRlc2AsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCBvcmllbnRhdGlvbklucHV0ID0gcGxheUdhbWVGb3JtLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICBgIyR7c2hpcH0tb3JpZW50YXRpb25gLFxuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc3QgZXJyb3JTcGFuID0gcGxheUdhbWVGb3JtLnF1ZXJ5U2VsZWN0b3IoYC4ke3NoaXB9LWVycm9yLXNwYW5gKTtcblxuICAgICAgICAgIGNvbnN0IHJhd0Nvb3JkaW5hdGVzID0gY29vcmRpbmF0ZUlucHV0LnZhbHVlO1xuICAgICAgICAgIGNvbnN0IHVwZGF0ZWRDb29yZGluYXRlcyA9IERPTS5zcGxpdENvb3JkaW5hdGVzKHJhd0Nvb3JkaW5hdGVzKTtcbiAgICAgICAgICBjb25zdCBvcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uSW5wdXQudmFsdWU7XG4gICAgICAgICAgZXJyb3JTcGFuLnRleHRDb250ZW50ID0gXCJcIjtcblxuICAgICAgICAgIGNvbnN0IHNoaXBQbGFjZW1lbnRXb3JrZWQgPSBwbGF5ZXJPbmUuZ2FtZWJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgICAgIHVwZGF0ZWRDb29yZGluYXRlc1swXSxcbiAgICAgICAgICAgIHVwZGF0ZWRDb29yZGluYXRlc1sxXSxcbiAgICAgICAgICAgIG9yaWVudGF0aW9uLFxuICAgICAgICAgICAgc2hpcCxcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChzaGlwUGxhY2VtZW50V29ya2VkICE9PSBcInBsYWNlZFwiKSB7XG4gICAgICAgICAgICBlcnJvclNwYW4udGV4dENvbnRlbnQgPSBgJHtzaGlwLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCl9JHtzaGlwLnNsaWNlKDEpfSBoYXMgYW4gZXJyb3IuICR7c2hpcFBsYWNlbWVudFdvcmtlZH1gO1xuICAgICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIERPTS5yZW5kZXJTaGlwcyhwbGF5ZXJPbmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBsYXlCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgIHBsYXllclR3by5nYW1lYm9hcmQucmFuZG9taXplU2hpcHMoKTtcbiAgICAgICAgICBET00ucmVuZGVyUGxheWVyQm9hcmRzKHBsYXllck9uZSwgcGxheWVyVHdvKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5R2FtZUZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBwbGFjZVNoaXBzRm4pO1xuXG4gICAgc2hpcFR5cGVzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGNvbnN0IGNvb3JkSW5wdXQgPSBwbGF5R2FtZUZvcm0ucXVlcnlTZWxlY3RvcihgIyR7c2hpcH0tY29vcmRpbmF0ZXNgKTtcblxuICAgICAgLy8gQ2xlYXIgY3VzdG9tIHZhbGlkaXR5IG9uIGNvb3JkaW5hdGUgaW5wdXRcbiAgICAgIGNvb3JkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcbiAgICAgICAgY29vcmRJbnB1dC5zZXRDdXN0b21WYWxpZGl0eShcIlwiKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzZXRHYW1lRm4gPSAoKSA9PiB7XG4gICAgICBwbGF5ZXJPbmUucmVzZXQoKTtcbiAgICAgIHBsYXllclR3by5yZXNldCgpO1xuICAgICAgRE9NLmNsZWFyQm9hcmRzKCk7XG4gICAgICBwbGF5QnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfTtcblxuICAgIHJlc2V0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZXNldEdhbWVGbik7XG4gIH1cblxuICBzdGF0aWMgY2xlYXJCb2FyZHMoKSB7XG4gICAgY29uc3QgZ2FtZVRpbGVzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWV0aWxlXCIpKTtcblxuICAgIGdhbWVUaWxlcy5mb3JFYWNoKChnYW1ldGlsZSkgPT4ge1xuICAgICAgZ2FtZXRpbGUuY2xhc3NOYW1lID0gXCJnYW1ldGlsZVwiO1xuICAgICAgZ2FtZXRpbGUuc3R5bGUuY3Vyc29yID0gXCJhdXRvXCI7XG5cbiAgICAgIGlmIChnYW1ldGlsZS5ib3VuZFBsYXllckF0dGFja0ZuKSB7XG4gICAgICAgIGdhbWV0aWxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBnYW1ldGlsZS5ib3VuZFBsYXllckF0dGFja0ZuKTtcbiAgICAgICAgZGVsZXRlIGdhbWV0aWxlLmJvdW5kUGxheWVyQXR0YWNrRm47XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyAgIGhlbHBlciBmdW5jdGlvbnMgZm9yIHRyYW5zZm9ybWluZyBjb29yZGluYXRlcyBhcyBuZWVkZWQgZm9yIHVzZSBpbiBkYXRhIGF0dHJpYnV0ZXNcbiAgc3RhdGljIGNvbWJpbmVDb29yZGluYXRlcyhhcnJheSkge1xuICAgIGxldCBuZXdBcnJheSA9IFtdO1xuICAgIGFycmF5LmZvckVhY2goKGNvb3JkaW5hdGVQYWlyKSA9PiB7XG4gICAgICBuZXdBcnJheS5wdXNoKGNvb3JkaW5hdGVQYWlyWzBdICsgY29vcmRpbmF0ZVBhaXJbMV0pO1xuICAgIH0pO1xuICAgIHJldHVybiBuZXdBcnJheTtcbiAgfVxuXG4gIHN0YXRpYyBzcGxpdENvb3JkaW5hdGVzKGNvb3JkaW5hdGUpIHtcbiAgICByZXR1cm4gW2Nvb3JkaW5hdGUuYXQoMCksIGNvb3JkaW5hdGUuc2xpY2UoMSkgKiAxXTtcbiAgfVxufVxuXG5leHBvcnQgeyBET00gfTtcbiIsIi8vIHN0YW5kYXJkIGJhdHRsZXNoaXAgaGFzIDUgc2hpcHNcbi8vICBjYXJyaWVyICg1IGhvbGVzKVxuLy8gIGJhdHRsZXNoaXAgKDQgaG9sZXMpXG4vLyAgY3J1aXNlciAoMyBob2xlcylcbi8vICBzdWJtYXJpbmUgKDMgaG9sZXMpXG4vLyAgZGVzdHJveWVyICgyIGhvbGVzKVxuXG5jbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3IobGVuZ3RoKSB7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5oaXRzID0gMDtcbiAgICB0aGlzLnN1bmsgPSBmYWxzZTtcbiAgfVxuXG4gIGhpdCgpIHtcbiAgICB0aGlzLmhpdHMrKztcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICByZXR1cm4gdGhpcy5oaXRzID49IHRoaXMubGVuZ3RoO1xuICB9XG59XG5cbi8vIEdhbWVib2FyZCBsYXlvdXQgdmlzdWFsIChjYWxsZWQgb3V0IGluIExFVFRFUiwgTlVNQkVSIGZvcm1hdClcbi8vICAgMSAyIDMgNCA1IDYgNyA4IDkgMTBcbi8vIEFcbi8vIEJcbi8vIENcbi8vIERcbi8vIEVcbi8vIEZcbi8vIEdcbi8vIEhcbi8vIElcbi8vIEpcblxuY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jYXJyaWVyID0ge1xuICAgICAgc2hpcDogbmV3IFNoaXAoNSksXG4gICAgICBjb29yZGluYXRlczogW10sXG4gICAgfTtcbiAgICB0aGlzLmJhdHRsZXNoaXAgPSB7XG4gICAgICBzaGlwOiBuZXcgU2hpcCg0KSxcbiAgICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICB9O1xuICAgIHRoaXMuY3J1aXNlciA9IHtcbiAgICAgIHNoaXA6IG5ldyBTaGlwKDMpLFxuICAgICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgIH07XG4gICAgdGhpcy5zdWJtYXJpbmUgPSB7XG4gICAgICBzaGlwOiBuZXcgU2hpcCgzKSxcbiAgICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICB9O1xuICAgIHRoaXMuZGVzdHJveWVyID0ge1xuICAgICAgc2hpcDogbmV3IFNoaXAoMiksXG4gICAgICBjb29yZGluYXRlczogW10sXG4gICAgfTtcbiAgICB0aGlzLmhpdHMgPSBbXTtcbiAgICB0aGlzLm1pc3NlcyA9IFtdO1xuICB9XG5cbiAgcGxhY2VTaGlwKGxldHRlckNvb3JkaW5hdGUsIG51bWJlckNvb3JkaW5hdGUsIG9yaWVudGF0aW9uLCBzaGlwVHlwZSkge1xuICAgIGxldCBlcnJvcjtcbiAgICBjb25zdCB1cHBlcmNhc2VMZXR0ZXJDb29yZGluYXRlID0gbGV0dGVyQ29vcmRpbmF0ZS50b1VwcGVyQ2FzZSgpO1xuICAgIGNvbnN0IGFsbG93ZWRMZXR0ZXJzID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiLCBcIkhcIiwgXCJJXCIsIFwiSlwiXTtcbiAgICBjb25zdCBsZXR0ZXJJbmRleCA9IGFsbG93ZWRMZXR0ZXJzLmluZGV4T2YodXBwZXJjYXNlTGV0dGVyQ29vcmRpbmF0ZSk7XG5cbiAgICBjb25zdCBzaGlwTGVuZ3RoID0gdGhpc1tzaGlwVHlwZV0uc2hpcC5sZW5ndGg7XG4gICAgbGV0IHNoaXBDb29yZGluYXRlcyA9IFtdO1xuICAgIGNvbnN0IGV4aXN0aW5nQ29vcmRpbmF0ZXMgPSB0aGlzLmxpc3RTaGlwTG9jYXRpb25zKCk7XG4gICAgbGV0IHBsYWNlU2hpcCA9IHRydWU7XG5cbiAgICBpZiAoXG4gICAgICAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiICYmIHNoaXBMZW5ndGggKyBudW1iZXJDb29yZGluYXRlID4gMTEpIHx8XG4gICAgICAob3JpZW50YXRpb24gPT09IFwidmVydGljYWxcIiAmJiBzaGlwTGVuZ3RoICsgbGV0dGVySW5kZXggPiAxMCkgfHxcbiAgICAgIGxldHRlckluZGV4ID09PSAtMSB8fFxuICAgICAgbnVtYmVyQ29vcmRpbmF0ZSA8IDEgfHxcbiAgICAgIG51bWJlckNvb3JkaW5hdGUgPiAxMFxuICAgICkge1xuICAgICAgZXJyb3IgPSBcIlNoaXBzIG11c3QgYmUgcGxhY2VkIGVudGlyZWx5IG9uIHRoZSBib2FyZC5cIjtcbiAgICAgIHBsYWNlU2hpcCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAgIHNoaXBDb29yZGluYXRlcy5wdXNoKFt1cHBlcmNhc2VMZXR0ZXJDb29yZGluYXRlLCBudW1iZXJDb29yZGluYXRlICsgaV0pO1xuICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICAgIHNoaXBDb29yZGluYXRlcy5wdXNoKFtcbiAgICAgICAgICBhbGxvd2VkTGV0dGVyc1tsZXR0ZXJJbmRleCArIGldLFxuICAgICAgICAgIG51bWJlckNvb3JkaW5hdGUsXG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNoaXBDb29yZGluYXRlcy5mb3JFYWNoKChuZXdDb29yZGluYXRlKSA9PiB7XG4gICAgICBleGlzdGluZ0Nvb3JkaW5hdGVzLmZvckVhY2goKG9sZENvb3JkaW5hdGUpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIG5ld0Nvb3JkaW5hdGVbMF0gPT09IG9sZENvb3JkaW5hdGVbMF0gJiZcbiAgICAgICAgICBuZXdDb29yZGluYXRlWzFdID09PSBvbGRDb29yZGluYXRlWzFdXG4gICAgICAgICkge1xuICAgICAgICAgIHBsYWNlU2hpcCA9IGZhbHNlO1xuICAgICAgICAgIGVycm9yID0gXCJTaGlwcyBjYW5ub3Qgb3ZlcmxhcC5cIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpZiAocGxhY2VTaGlwKSB7XG4gICAgICB0aGlzW3NoaXBUeXBlXS5jb29yZGluYXRlcyA9IHNoaXBDb29yZGluYXRlcztcbiAgICAgIHJldHVybiBcInBsYWNlZFwiO1xuICAgIH0gZWxzZSByZXR1cm4gZXJyb3I7XG4gIH1cblxuICByYW5kb21pemVTaGlwcygpIHtcbiAgICB0aGlzLnJlbW92ZUFsbFNoaXBzKCk7XG4gICAgY29uc3Qgc2hpcFR5cGVzID0gdGhpcy5saXN0U2hpcFR5cGVzKCk7XG5cbiAgICBzaGlwVHlwZXMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgbGV0IHBsYWNlZCA9IGZhbHNlO1xuICAgICAgbGV0IGF0dGVtcHRzID0gMDtcbiAgICAgIGNvbnN0IG1heEF0dGVtcHRzID0gNTAwO1xuXG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSB7XG4gICAgICAgIGhvcml6b250YWw6IHRoaXMuZ2FtZWJvYXJkQ29vcmRpbmF0ZXMoKSxcbiAgICAgICAgdmVydGljYWw6IHRoaXMuZ2FtZWJvYXJkQ29vcmRpbmF0ZXMoKSxcbiAgICAgIH07XG5cbiAgICAgIHdoaWxlICghcGxhY2VkICYmIGF0dGVtcHRzIDw9IG1heEF0dGVtcHRzKSB7XG4gICAgICAgIGNvbnN0IG9yaWVudGF0aW9uID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuICAgICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgTWF0aC5yYW5kb20oKSAqIGNvb3JkaW5hdGVzW29yaWVudGF0aW9uXS5sZW5ndGgsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHJhbmRvbUNvb3JkaW5hdGUgPSBjb29yZGluYXRlc1tvcmllbnRhdGlvbl1bcmFuZG9tSW5kZXhdO1xuXG4gICAgICAgIGNvbnN0IHNoaXBQbGFjZW1lbnRXb3JrZWQgPSB0aGlzLnBsYWNlU2hpcChcbiAgICAgICAgICByYW5kb21Db29yZGluYXRlWzBdLFxuICAgICAgICAgIHJhbmRvbUNvb3JkaW5hdGVbMV0sXG4gICAgICAgICAgb3JpZW50YXRpb24sXG4gICAgICAgICAgc2hpcCxcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHNoaXBQbGFjZW1lbnRXb3JrZWQgIT09IFwicGxhY2VkXCIpIHtcbiAgICAgICAgICBjb29yZGluYXRlc1tvcmllbnRhdGlvbl0uc3BsaWNlKHJhbmRvbUluZGV4LCAxKTtcbiAgICAgICAgICAvLyB0cnkgYWdhaW5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwbGFjZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYXR0ZW1wdHMrKztcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKHRoaXNbc2hpcF0uY29vcmRpbmF0ZXMpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlU2hpcChzaGlwKSB7XG4gICAgdGhpc1tzaGlwXS5jb29yZGluYXRlcyA9IFtdO1xuICB9XG5cbiAgcmVtb3ZlQWxsU2hpcHMoKSB7XG4gICAgY29uc3Qgc2hpcFR5cGVzID0gdGhpcy5saXN0U2hpcFR5cGVzKCk7XG5cbiAgICBzaGlwVHlwZXMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgdGhpcy5yZW1vdmVTaGlwKHNoaXApO1xuICAgIH0pO1xuICB9XG5cbiAgcmVjZWl2ZUF0dGFjayhsZXR0ZXJDb29yZGluYXRlLCBudW1iZXJDb29yZGluYXRlKSB7XG4gICAgY29uc3Qgc2hpcFR5cGVzID0gdGhpcy5saXN0U2hpcFR5cGVzKCk7XG4gICAgbGV0IGhpdCA9IGZhbHNlO1xuXG4gICAgc2hpcFR5cGVzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIHRoaXNbc2hpcF0uY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmRpbmF0ZSkgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgY29vcmRpbmF0ZVswXSA9PT0gbGV0dGVyQ29vcmRpbmF0ZSAmJlxuICAgICAgICAgIGNvb3JkaW5hdGVbMV0gPT09IG51bWJlckNvb3JkaW5hdGVcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5oaXRzLnB1c2goW2xldHRlckNvb3JkaW5hdGUsIG51bWJlckNvb3JkaW5hdGVdKTtcbiAgICAgICAgICB0aGlzW3NoaXBdLnNoaXAuaGl0KCk7XG4gICAgICAgICAgaGl0ID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaWYgKGhpdCA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMubWlzc2VzLnB1c2goW2xldHRlckNvb3JkaW5hdGUsIG51bWJlckNvb3JkaW5hdGVdKTtcbiAgICB9XG4gIH1cblxuICBsaXN0U2hpcExvY2F0aW9ucygpIHtcbiAgICBsZXQgc2hpcExvY2F0aW9ucyA9IFtdO1xuXG4gICAgdGhpcy5saXN0U2hpcFR5cGVzKCkuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgc2hpcExvY2F0aW9ucyA9IHNoaXBMb2NhdGlvbnMuY29uY2F0KHRoaXNbc2hpcF0uY29vcmRpbmF0ZXMpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNoaXBMb2NhdGlvbnM7XG4gIH1cblxuICBsaXN0R3JpZENlbGxzV2l0aEFzc29jaWF0ZWRTaGlwKCkge1xuICAgIGxldCBzaGlwTG9jYXRpb25zID0gW107XG5cbiAgICB0aGlzLmxpc3RTaGlwVHlwZXMoKS5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBpZiAodGhpc1tzaGlwXS5jb29yZGluYXRlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGVuZ3RoID0gdGhpc1tzaGlwXS5zaGlwLmxlbmd0aDtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpc1tzaGlwXS5jb29yZGluYXRlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzaGlwTG9jYXRpb25zLnB1c2goW1xuICAgICAgICAgICAgW3RoaXNbc2hpcF0uY29vcmRpbmF0ZXNbaV1bMF0gKyB0aGlzW3NoaXBdLmNvb3JkaW5hdGVzW2ldWzFdXSxcbiAgICAgICAgICAgIHNoaXAsXG4gICAgICAgICAgXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc2hpcExvY2F0aW9ucztcbiAgfVxuXG4gIGxpc3RTaGlwVHlwZXMoKSB7XG4gICAgcmV0dXJuIFtcImNhcnJpZXJcIiwgXCJiYXR0bGVzaGlwXCIsIFwiY3J1aXNlclwiLCBcInN1Ym1hcmluZVwiLCBcImRlc3Ryb3llclwiXTtcbiAgfVxuXG4gIHBsYWNlZFNoaXBzKCkge1xuICAgIGNvbnN0IGFsbFNoaXBUeXBlcyA9IHRoaXMubGlzdFNoaXBUeXBlcygpO1xuICAgIGxldCBwbGFjZWRTaGlwcyA9IDA7XG5cbiAgICBhbGxTaGlwVHlwZXMuZm9yRWFjaCgoc2hpcFR5cGUpID0+IHtcbiAgICAgIGlmICh0aGlzW3NoaXBUeXBlXS5jb29yZGluYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHBsYWNlZFNoaXBzKys7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcGxhY2VkU2hpcHM7XG4gIH1cblxuICBhbGxTaGlwc1BsYWNlZCgpIHtcbiAgICByZXR1cm4gKHRoaXMucGxhY2VkU2hpcHMgPSA1KTtcbiAgfVxuXG4gIGFsbFNoaXBzU3VuaygpIHtcbiAgICBsZXQgbnVtYmVyT2ZTdW5rZW5TaGlwcyA9IDA7XG4gICAgY29uc3QgYWxsU2hpcFR5cGVzID0gdGhpcy5saXN0U2hpcFR5cGVzKCk7XG5cbiAgICBhbGxTaGlwVHlwZXMuZm9yRWFjaCgoc2hpcFR5cGUpID0+IHtcbiAgICAgIGlmICh0aGlzW3NoaXBUeXBlXS5zaGlwLmlzU3VuaygpKSB7XG4gICAgICAgIG51bWJlck9mU3Vua2VuU2hpcHMrKztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBudW1iZXJPZlN1bmtlblNoaXBzID09PSA1O1xuICAgIC8vIG9uY2UgZ2FtZSBpcyBmdWxseSBpbXBsZW1lbnRlZCBhbmQgcGxheWVycyBtdXN0IHN0YXJ0IG91dCB3aXRoIDUgc2hpcHMsIGNvdWxkIHJlZHVjZSB0aGlzIGxvZ2ljIHRvIGNoZWNrIGlmIDUgc2hpcHMgYXJlIHN1bmtcbiAgfVxuXG4gIGdhbWVib2FyZENvb3JkaW5hdGVzKCkge1xuICAgIHJldHVybiBbXG4gICAgICBbXCJBXCIsIDFdLFxuICAgICAgW1wiQVwiLCAyXSxcbiAgICAgIFtcIkFcIiwgM10sXG4gICAgICBbXCJBXCIsIDRdLFxuICAgICAgW1wiQVwiLCA1XSxcbiAgICAgIFtcIkFcIiwgNl0sXG4gICAgICBbXCJBXCIsIDddLFxuICAgICAgW1wiQVwiLCA4XSxcbiAgICAgIFtcIkFcIiwgOV0sXG4gICAgICBbXCJBXCIsIDEwXSxcblxuICAgICAgW1wiQlwiLCAxXSxcbiAgICAgIFtcIkJcIiwgMl0sXG4gICAgICBbXCJCXCIsIDNdLFxuICAgICAgW1wiQlwiLCA0XSxcbiAgICAgIFtcIkJcIiwgNV0sXG4gICAgICBbXCJCXCIsIDZdLFxuICAgICAgW1wiQlwiLCA3XSxcbiAgICAgIFtcIkJcIiwgOF0sXG4gICAgICBbXCJCXCIsIDldLFxuICAgICAgW1wiQlwiLCAxMF0sXG5cbiAgICAgIFtcIkNcIiwgMV0sXG4gICAgICBbXCJDXCIsIDJdLFxuICAgICAgW1wiQ1wiLCAzXSxcbiAgICAgIFtcIkNcIiwgNF0sXG4gICAgICBbXCJDXCIsIDVdLFxuICAgICAgW1wiQ1wiLCA2XSxcbiAgICAgIFtcIkNcIiwgN10sXG4gICAgICBbXCJDXCIsIDhdLFxuICAgICAgW1wiQ1wiLCA5XSxcbiAgICAgIFtcIkNcIiwgMTBdLFxuXG4gICAgICBbXCJEXCIsIDFdLFxuICAgICAgW1wiRFwiLCAyXSxcbiAgICAgIFtcIkRcIiwgM10sXG4gICAgICBbXCJEXCIsIDRdLFxuICAgICAgW1wiRFwiLCA1XSxcbiAgICAgIFtcIkRcIiwgNl0sXG4gICAgICBbXCJEXCIsIDddLFxuICAgICAgW1wiRFwiLCA4XSxcbiAgICAgIFtcIkRcIiwgOV0sXG4gICAgICBbXCJEXCIsIDEwXSxcblxuICAgICAgW1wiRVwiLCAxXSxcbiAgICAgIFtcIkVcIiwgMl0sXG4gICAgICBbXCJFXCIsIDNdLFxuICAgICAgW1wiRVwiLCA0XSxcbiAgICAgIFtcIkVcIiwgNV0sXG4gICAgICBbXCJFXCIsIDZdLFxuICAgICAgW1wiRVwiLCA3XSxcbiAgICAgIFtcIkVcIiwgOF0sXG4gICAgICBbXCJFXCIsIDldLFxuICAgICAgW1wiRVwiLCAxMF0sXG5cbiAgICAgIFtcIkZcIiwgMV0sXG4gICAgICBbXCJGXCIsIDJdLFxuICAgICAgW1wiRlwiLCAzXSxcbiAgICAgIFtcIkZcIiwgNF0sXG4gICAgICBbXCJGXCIsIDVdLFxuICAgICAgW1wiRlwiLCA2XSxcbiAgICAgIFtcIkZcIiwgN10sXG4gICAgICBbXCJGXCIsIDhdLFxuICAgICAgW1wiRlwiLCA5XSxcbiAgICAgIFtcIkZcIiwgMTBdLFxuXG4gICAgICBbXCJHXCIsIDFdLFxuICAgICAgW1wiR1wiLCAyXSxcbiAgICAgIFtcIkdcIiwgM10sXG4gICAgICBbXCJHXCIsIDRdLFxuICAgICAgW1wiR1wiLCA1XSxcbiAgICAgIFtcIkdcIiwgNl0sXG4gICAgICBbXCJHXCIsIDddLFxuICAgICAgW1wiR1wiLCA4XSxcbiAgICAgIFtcIkdcIiwgOV0sXG4gICAgICBbXCJHXCIsIDEwXSxcblxuICAgICAgW1wiSFwiLCAxXSxcbiAgICAgIFtcIkhcIiwgMl0sXG4gICAgICBbXCJIXCIsIDNdLFxuICAgICAgW1wiSFwiLCA0XSxcbiAgICAgIFtcIkhcIiwgNV0sXG4gICAgICBbXCJIXCIsIDZdLFxuICAgICAgW1wiSFwiLCA3XSxcbiAgICAgIFtcIkhcIiwgOF0sXG4gICAgICBbXCJIXCIsIDldLFxuICAgICAgW1wiSFwiLCAxMF0sXG5cbiAgICAgIFtcIklcIiwgMV0sXG4gICAgICBbXCJJXCIsIDJdLFxuICAgICAgW1wiSVwiLCAzXSxcbiAgICAgIFtcIklcIiwgNF0sXG4gICAgICBbXCJJXCIsIDVdLFxuICAgICAgW1wiSVwiLCA2XSxcbiAgICAgIFtcIklcIiwgN10sXG4gICAgICBbXCJJXCIsIDhdLFxuICAgICAgW1wiSVwiLCA5XSxcbiAgICAgIFtcIklcIiwgMTBdLFxuXG4gICAgICBbXCJKXCIsIDFdLFxuICAgICAgW1wiSlwiLCAyXSxcbiAgICAgIFtcIkpcIiwgM10sXG4gICAgICBbXCJKXCIsIDRdLFxuICAgICAgW1wiSlwiLCA1XSxcbiAgICAgIFtcIkpcIiwgNl0sXG4gICAgICBbXCJKXCIsIDddLFxuICAgICAgW1wiSlwiLCA4XSxcbiAgICAgIFtcIkpcIiwgOV0sXG4gICAgICBbXCJKXCIsIDEwXSxcbiAgICBdO1xuICB9XG59XG5cbmNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKHBsYXllciwgdHlwZSkge1xuICAgIHRoaXMucGxheWVyTnVtYmVyID0gcGxheWVyO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5nYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgdGhpcy5fcGxhY2VzVG9BdHRhY2sgPSB0aGlzLmdhbWVib2FyZC5nYW1lYm9hcmRDb29yZGluYXRlcygpO1xuICB9XG5cbiAgQUlBdHRhY2soKSB7XG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLl9wbGFjZXNUb0F0dGFjay5sZW5ndGgpO1xuICAgIGNvbnN0IHJhbmRvbUNvb3JkaW5hdGUgPSB0aGlzLl9wbGFjZXNUb0F0dGFja1tyYW5kb21JbmRleF07XG4gICAgdGhpcy5fcGxhY2VzVG9BdHRhY2suc3BsaWNlKHJhbmRvbUluZGV4LCAxKTtcbiAgICByZXR1cm4gcmFuZG9tQ29vcmRpbmF0ZTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZ2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgIHRoaXMuX3BsYWNlc1RvQXR0YWNrID0gdGhpcy5nYW1lYm9hcmQuZ2FtZWJvYXJkQ29vcmRpbmF0ZXMoKTtcbiAgfVxufVxuXG5leHBvcnQgeyBTaGlwLCBHYW1lYm9hcmQsIFBsYXllciB9O1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYGh0bWwsXG5ib2R5LFxuZGl2LFxuc3BhbixcbmFwcGxldCxcbm9iamVjdCxcbmlmcmFtZSxcbmgxLFxuaDIsXG5oMyxcbmg0LFxuaDUsXG5oNixcbnAsXG5ibG9ja3F1b3RlLFxucHJlLFxuYSxcbmFiYnIsXG5hY3JvbnltLFxuYWRkcmVzcyxcbmJpZyxcbmNpdGUsXG5jb2RlLFxuZGVsLFxuZGZuLFxuZW0sXG5pbWcsXG5pbnMsXG5rYmQsXG5xLFxucyxcbnNhbXAsXG5zbWFsbCxcbnN0cmlrZSxcbnN0cm9uZyxcbnN1YixcbnN1cCxcbnR0LFxudmFyLFxuYixcbnUsXG5pLFxuY2VudGVyLFxuZGwsXG5kdCxcbmRkLFxub2wsXG51bCxcbmxpLFxuZmllbGRzZXQsXG5mb3JtLFxubGFiZWwsXG5sZWdlbmQsXG50YWJsZSxcbmNhcHRpb24sXG50Ym9keSxcbnRmb290LFxudGhlYWQsXG50cixcbnRoLFxudGQsXG5hcnRpY2xlLFxuYXNpZGUsXG5jYW52YXMsXG5kZXRhaWxzLFxuZW1iZWQsXG5maWd1cmUsXG5maWdjYXB0aW9uLFxuZm9vdGVyLFxuaGVhZGVyLFxuaGdyb3VwLFxubWVudSxcbm5hdixcbm91dHB1dCxcbnJ1YnksXG5zZWN0aW9uLFxuc3VtbWFyeSxcbnRpbWUsXG5tYXJrLFxuYXVkaW8sXG52aWRlbyB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgYm9yZGVyOiAwO1xuICBmb250LXNpemU6IDEwMCU7XG4gIGZvbnQ6IGluaGVyaXQ7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cbmFydGljbGUsXG5hc2lkZSxcbmRldGFpbHMsXG5maWdjYXB0aW9uLFxuZmlndXJlLFxuZm9vdGVyLFxuaGVhZGVyLFxuaGdyb3VwLFxubWVudSxcbm5hdixcbnNlY3Rpb24ge1xuICBkaXNwbGF5OiBibG9jaztcbn1cbmJvZHkge1xuICBsaW5lLWhlaWdodDogMTtcbn1cbm9sLFxudWwge1xuICBsaXN0LXN0eWxlOiBub25lO1xufVxuYmxvY2txdW90ZSxcbnEge1xuICBxdW90ZXM6IG5vbmU7XG59XG5ibG9ja3F1b3RlOmJlZm9yZSxcbmJsb2NrcXVvdGU6YWZ0ZXIsXG5xOmJlZm9yZSxcbnE6YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBjb250ZW50OiBub25lO1xufVxudGFibGUge1xuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICBib3JkZXItc3BhY2luZzogMDtcbn1cblxuYm9keSB7XG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2U7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG59XG5cbmhlYWRlciB7XG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgjMDUyZjVmLCAjMDA1Mzc3KTtcbiAgY29sb3I6IHdoaXRlO1xuICBmb250LXNpemU6IDRyZW07XG4gIHBhZGRpbmc6IDFyZW07XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbn1cblxuaGVhZGVyID4gc3BhbiB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xufVxuXG5Aa2V5ZnJhbWVzIG9zY2lsbGF0ZSB7XG4gIGZyb20ge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKSBzY2FsZSgwKTtcbiAgICBvcGFjaXR5OiAwLjM7XG4gIH1cbiAgdG8ge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKSBzY2FsZSgxKTtcbiAgICBvcGFjaXR5OiAwLjg7XG4gIH1cbn1cblxuLmV4cGxvc2lvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcbiAgYW5pbWF0aW9uOiBvc2NpbGxhdGUgMS43NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xuICB6LWluZGV4OiAxO1xufVxuXG4uZm9ybS1jb250YWluZXIge1xuICBwYWRkaW5nOiAxNXB4O1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoIzAwNTM3NzNiLCAjZjFhMzA4YjApO1xufVxuXG4uZm9ybS1oZWFkZXIge1xuICBmb250LXNpemU6IDJyZW07XG4gIHBhZGRpbmc6IDhweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBjb2xvcjogIzc0MDgwMDtcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG59XG5cbmZvcm0ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGdhcDogMTVweDtcbiAgcGFkZGluZzogMTVweDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZm9udC1zaXplOiAxLjVyZW07XG59XG5cbmZvcm0gPiBkaXYge1xuICBmbGV4OiAwIDEgNDQwcHg7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIHBhZGRpbmc6IDRweDtcbiAgZ2FwOiAxMHB4O1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmciAxZnIgMjBweDtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgcGFkZGluZy1yaWdodDogMTBweDtcbiAgYm9yZGVyLXJpZ2h0OiAxcHggZ3JleSBkb3R0ZWQ7XG4gIGJvcmRlci1ib3R0b206IDFweCBncmV5IGRvdHRlZDtcbn1cblxuLmNhcnJpZXItY29udGFpbmVyIHtcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43NDcpO1xufVxuXG4uYmF0dGxlc2hpcC1jb250YWluZXIge1xuICBjb2xvcjogcmdiYSgwLCA4NywgNCwgMC43NDcpO1xufVxuXG4uY3J1aXNlci1jb250YWluZXIge1xuICBjb2xvcjogcmdiYSgxOTksIDAsIDAsIDAuNzQ3KTtcbn1cblxuLnN1Ym1hcmluZS1jb250YWluZXIge1xuICBjb2xvcjogcmdiYSgxNywgMCwgMTczLCAwLjc0Nyk7XG59XG5cbi5kZXN0cm95ZXItY29udGFpbmVyIHtcbiAgY29sb3I6IHJnYmEoMTI2LCAwLCAxMTksIDAuNzQ3KTtcbn1cblxuZm9ybSA+IGRpdiA+IGRpdiB7XG4gIGZvbnQtc2l6ZTogMS44cmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgcGFkZGluZy1yaWdodDogMTBweDtcbiAgZ3JpZC1hcmVhOiAxIC8gMSAvIDIgLyAyO1xufVxuXG5zZWxlY3Qge1xuICB3aWR0aDogbWluLWNvbnRlbnQ7XG4gIGp1c3RpZnktc2VsZjogZW5kO1xuICBmb250LXNpemU6IDFyZW07XG4gIHBhZGRpbmc6IDRweDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBncmlkLWFyZWE6IDEgLyAyIC8gMiAvIDQ7XG59XG5cbmxhYmVsIHtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBqdXN0aWZ5LXNlbGY6IGVuZDtcbiAgZ3JpZC1hcmVhOiAyIC8gMiAvIDMgLyAzO1xufVxuXG5pbnB1dFt0eXBlPVwidGV4dFwiXSB7XG4gIHBhZGRpbmc6IDRweDtcbiAgd2lkdGg6IDQwcHg7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAganVzdGlmeS1zZWxmOiBlbmQ7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgZ3JpZC1hcmVhOiAyIC8gMyAvIDMgLyA0O1xufVxuXG4uZXJyb3Ige1xuICBmb250LXNpemU6IDE2cHg7XG4gIGNvbG9yOiByZWQ7XG4gIGdyaWQtYXJlYTogMyAvIDEgLyA0IC8gNDtcbn1cblxuLmJ1dHRvbnMge1xuICB3aWR0aDogNDAwcHg7XG4gIGhlaWdodDogbWluLWNvbnRlbnQ7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gIGJvcmRlcjogbm9uZTtcbn1cblxuI3BsYXktZ2FtZS1idG4sXG4jcmVzZXQtZ2FtZS1idG4ge1xuICBwYWRkaW5nOiAxMHB4IDIwcHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG4gIGZvbnQtc2l6ZTogMnJlbTtcbiAgYm9yZGVyOiAxcHggYmxhY2sgc29saWQ7XG4gIGJvcmRlci1yYWRpdXM6IDE1cHg7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgbWFyZ2luOiA1cHg7XG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4zcyBlYXNlO1xufVxuXG4jcGxheS1nYW1lLWJ0biB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwNTJmNWY7XG4gIGNvbG9yOiB3aGl0ZTtcbn1cblxuI3BsYXktZ2FtZS1idG46aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA1Mzc3O1xufVxuXG4jcmVzZXQtZ2FtZS1idG4ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjQ0MzM2O1xuICBjb2xvcjogd2hpdGU7XG59XG5cbiNyZXNldC1nYW1lLWJ0bjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkYTE5MGI7XG59XG5cbiNwbGF5LWdhbWUtYnRuOmFjdGl2ZSxcbiNyZXNldC1nYW1lLWJ0bjphY3RpdmUge1xuICB0cmFuc2Zvcm06IHNjYWxlKDAuOTUpO1xufVxuXG4uZ2FtZWJvYXJkcyB7XG4gIG1hcmdpbi10b3A6IDI1cHg7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IG1pbi1jb250ZW50O1xuICBkaXNwbGF5OiBmbGV4O1xuICBjb2x1bW4tZ2FwOiAxMHZ3O1xuICByb3ctZ2FwOiAyNXB4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgZmxleC13cmFwOiB3cmFwO1xufVxuXG4uZ2FtZWJvYXJkIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ2FwOiAwcHg7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDExLCAzMnB4KTtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTEsIDMycHgpO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgbWFyZ2luLWJvdHRvbTogMjRweDtcbn1cblxuLmNvbHVtbi1udW1iZXIsXG4ucm93LWxldHRlciB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC1zaXplOiAyMHB4O1xuICBhbGlnbi1zZWxmOiBjZW50ZXI7XG59XG5cbi5nYW1ldGlsZSB7XG4gIHdpZHRoOiAzMnB4O1xuICBoZWlnaHQ6IDMycHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwNmE3N2Q7XG59XG5cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogNzY4cHgpIHtcbiAgLmdhbWVib2FyZCB7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTEsIDU2cHgpO1xuICAgIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDExLCA1NnB4KTtcbiAgfVxuXG4gIC5jb2x1bW4tbnVtYmVyLFxuICAucm93LWxldHRlciB7XG4gICAgZm9udC1zaXplOiAzMHB4O1xuICB9XG5cbiAgLmdhbWV0aWxlIHtcbiAgICB3aWR0aDogNTZweDtcbiAgICBoZWlnaHQ6IDU2cHg7XG4gIH1cbn1cblxuLmNhcnJpZXIsXG4uYmF0dGxlc2hpcCxcbi5jcnVpc2VyLFxuLnN1Ym1hcmluZSxcbi5kZXN0cm95ZXIge1xuICBib3JkZXI6IDFweCBzb2xpZCBncmV5O1xufVxuXG4uY2FycmllciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43NDcpO1xufVxuXG4uYmF0dGxlc2hpcCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgODcsIDQsIDAuNzQ3KTtcbn1cblxuLmNydWlzZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDE5OSwgMCwgMCwgMC43NDcpO1xufVxuXG4uc3VibWFyaW5lIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxNywgMCwgMTczLCAwLjc0Nyk7XG59XG5cbi5kZXN0cm95ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDEyNiwgMCwgMTE5LCAwLjc0Nyk7XG59XG5cbi5oaXQ6OmFmdGVyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBjb250ZW50OiBcIvCfjq9cIjtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IDUwJTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gIGZvbnQtc2l6ZTogMjRweDtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG5cbi5taXNzOjphZnRlciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgY29udGVudDogXCLirZVcIjtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IDUwJTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gIGZvbnQtc2l6ZTogMjRweDtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG5cbi5taXNzLFxuLmhpdCB7XG4gIGN1cnNvcjogYXV0bztcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBaUZFLFNBQVM7RUFDVCxVQUFVO0VBQ1YsU0FBUztFQUNULGVBQWU7RUFDZixhQUFhO0VBQ2Isd0JBQXdCO0FBQzFCO0FBQ0E7Ozs7Ozs7Ozs7O0VBV0UsY0FBYztBQUNoQjtBQUNBO0VBQ0UsY0FBYztBQUNoQjtBQUNBOztFQUVFLGdCQUFnQjtBQUNsQjtBQUNBOztFQUVFLFlBQVk7QUFDZDtBQUNBOzs7O0VBSUUsV0FBVztFQUNYLGFBQWE7QUFDZjtBQUNBO0VBQ0UseUJBQXlCO0VBQ3pCLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLHNCQUFzQjtFQUN0QixhQUFhO0VBQ2Isc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsbURBQW1EO0VBQ25ELFlBQVk7RUFDWixlQUFlO0VBQ2YsYUFBYTtFQUNiLGtCQUFrQjtFQUNsQixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0U7SUFDRSxvQ0FBb0M7SUFDcEMsWUFBWTtFQUNkO0VBQ0E7SUFDRSxvQ0FBb0M7SUFDcEMsWUFBWTtFQUNkO0FBQ0Y7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsTUFBTTtFQUNOLFNBQVM7RUFDVCwyQkFBMkI7RUFDM0IsNkNBQTZDO0VBQzdDLFVBQVU7QUFDWjs7QUFFQTtFQUNFLGFBQWE7RUFDYix1REFBdUQ7QUFDekQ7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsWUFBWTtFQUNaLG1CQUFtQjtFQUNuQixrQkFBa0I7RUFDbEIsY0FBYztFQUNkLDBCQUEwQjtBQUM1Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYixlQUFlO0VBQ2YsU0FBUztFQUNULGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsZUFBZTtFQUNmLGFBQWE7RUFDYixZQUFZO0VBQ1osU0FBUztFQUNULGdDQUFnQztFQUNoQyxtQkFBbUI7RUFDbkIsbUJBQW1CO0VBQ25CLDZCQUE2QjtFQUM3Qiw4QkFBOEI7QUFDaEM7O0FBRUE7RUFDRSwyQkFBMkI7QUFDN0I7O0FBRUE7RUFDRSw0QkFBNEI7QUFDOUI7O0FBRUE7RUFDRSw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSw4QkFBOEI7QUFDaEM7O0FBRUE7RUFDRSwrQkFBK0I7QUFDakM7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsaUJBQWlCO0VBQ2pCLGdCQUFnQjtFQUNoQixtQkFBbUI7RUFDbkIsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLGlCQUFpQjtFQUNqQixlQUFlO0VBQ2YsWUFBWTtFQUNaLGtCQUFrQjtFQUNsQix3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsaUJBQWlCO0VBQ2pCLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLFlBQVk7RUFDWixXQUFXO0VBQ1gsZUFBZTtFQUNmLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLFVBQVU7RUFDVix3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osbUJBQW1CO0VBQ25CLGFBQWE7RUFDYixlQUFlO0VBQ2YsNkJBQTZCO0VBQzdCLFlBQVk7QUFDZDs7QUFFQTs7RUFFRSxrQkFBa0I7RUFDbEIsbUJBQW1CO0VBQ25CLGVBQWU7RUFDZix1QkFBdUI7RUFDdkIsbUJBQW1CO0VBQ25CLGVBQWU7RUFDZixXQUFXO0VBQ1gsc0NBQXNDO0FBQ3hDOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLFlBQVk7QUFDZDs7QUFFQTtFQUNFLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6QixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSx5QkFBeUI7QUFDM0I7O0FBRUE7O0VBRUUsc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLFdBQVc7RUFDWCxtQkFBbUI7RUFDbkIsYUFBYTtFQUNiLGdCQUFnQjtFQUNoQixhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsUUFBUTtFQUNSLHVDQUF1QztFQUN2QyxvQ0FBb0M7RUFDcEMsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtBQUNyQjs7QUFFQTs7RUFFRSxrQkFBa0I7RUFDbEIsZUFBZTtFQUNmLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLFdBQVc7RUFDWCxZQUFZO0VBQ1osdUJBQXVCO0VBQ3ZCLGtCQUFrQjtFQUNsQixzQkFBc0I7RUFDdEIseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0U7SUFDRSx1Q0FBdUM7SUFDdkMsb0NBQW9DO0VBQ3RDOztFQUVBOztJQUVFLGVBQWU7RUFDakI7O0VBRUE7SUFDRSxXQUFXO0lBQ1gsWUFBWTtFQUNkO0FBQ0Y7O0FBRUE7Ozs7O0VBS0Usc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0Usc0NBQXNDO0FBQ3hDOztBQUVBO0VBQ0UsdUNBQXVDO0FBQ3pDOztBQUVBO0VBQ0Usd0NBQXdDO0FBQzFDOztBQUVBO0VBQ0UseUNBQXlDO0FBQzNDOztBQUVBO0VBQ0UsMENBQTBDO0FBQzVDOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLGFBQWE7RUFDYixRQUFRO0VBQ1IsU0FBUztFQUNULGdDQUFnQztFQUNoQyxlQUFlO0VBQ2Ysb0JBQW9CO0FBQ3RCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLFlBQVk7RUFDWixRQUFRO0VBQ1IsU0FBUztFQUNULGdDQUFnQztFQUNoQyxlQUFlO0VBQ2Ysb0JBQW9CO0FBQ3RCOztBQUVBOztFQUVFLFlBQVk7QUFDZFwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJodG1sLFxcbmJvZHksXFxuZGl2LFxcbnNwYW4sXFxuYXBwbGV0LFxcbm9iamVjdCxcXG5pZnJhbWUsXFxuaDEsXFxuaDIsXFxuaDMsXFxuaDQsXFxuaDUsXFxuaDYsXFxucCxcXG5ibG9ja3F1b3RlLFxcbnByZSxcXG5hLFxcbmFiYnIsXFxuYWNyb255bSxcXG5hZGRyZXNzLFxcbmJpZyxcXG5jaXRlLFxcbmNvZGUsXFxuZGVsLFxcbmRmbixcXG5lbSxcXG5pbWcsXFxuaW5zLFxcbmtiZCxcXG5xLFxcbnMsXFxuc2FtcCxcXG5zbWFsbCxcXG5zdHJpa2UsXFxuc3Ryb25nLFxcbnN1YixcXG5zdXAsXFxudHQsXFxudmFyLFxcbmIsXFxudSxcXG5pLFxcbmNlbnRlcixcXG5kbCxcXG5kdCxcXG5kZCxcXG5vbCxcXG51bCxcXG5saSxcXG5maWVsZHNldCxcXG5mb3JtLFxcbmxhYmVsLFxcbmxlZ2VuZCxcXG50YWJsZSxcXG5jYXB0aW9uLFxcbnRib2R5LFxcbnRmb290LFxcbnRoZWFkLFxcbnRyLFxcbnRoLFxcbnRkLFxcbmFydGljbGUsXFxuYXNpZGUsXFxuY2FudmFzLFxcbmRldGFpbHMsXFxuZW1iZWQsXFxuZmlndXJlLFxcbmZpZ2NhcHRpb24sXFxuZm9vdGVyLFxcbmhlYWRlcixcXG5oZ3JvdXAsXFxubWVudSxcXG5uYXYsXFxub3V0cHV0LFxcbnJ1YnksXFxuc2VjdGlvbixcXG5zdW1tYXJ5LFxcbnRpbWUsXFxubWFyayxcXG5hdWRpbyxcXG52aWRlbyB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm9yZGVyOiAwO1xcbiAgZm9udC1zaXplOiAxMDAlO1xcbiAgZm9udDogaW5oZXJpdDtcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuYXJ0aWNsZSxcXG5hc2lkZSxcXG5kZXRhaWxzLFxcbmZpZ2NhcHRpb24sXFxuZmlndXJlLFxcbmZvb3RlcixcXG5oZWFkZXIsXFxuaGdyb3VwLFxcbm1lbnUsXFxubmF2LFxcbnNlY3Rpb24ge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcbmJvZHkge1xcbiAgbGluZS1oZWlnaHQ6IDE7XFxufVxcbm9sLFxcbnVsIHtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxufVxcbmJsb2NrcXVvdGUsXFxucSB7XFxuICBxdW90ZXM6IG5vbmU7XFxufVxcbmJsb2NrcXVvdGU6YmVmb3JlLFxcbmJsb2NrcXVvdGU6YWZ0ZXIsXFxucTpiZWZvcmUsXFxucTphZnRlciB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIGNvbnRlbnQ6IG5vbmU7XFxufVxcbnRhYmxlIHtcXG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxuICBib3JkZXItc3BhY2luZzogMDtcXG59XFxuXFxuYm9keSB7XFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcblxcbmhlYWRlciB7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoIzA1MmY1ZiwgIzAwNTM3Nyk7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXNpemU6IDRyZW07XFxuICBwYWRkaW5nOiAxcmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG59XFxuXFxuaGVhZGVyID4gc3BhbiB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxufVxcblxcbkBrZXlmcmFtZXMgb3NjaWxsYXRlIHtcXG4gIGZyb20ge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSkgc2NhbGUoMCk7XFxuICAgIG9wYWNpdHk6IDAuMztcXG4gIH1cXG4gIHRvIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpIHNjYWxlKDEpO1xcbiAgICBvcGFjaXR5OiAwLjg7XFxuICB9XFxufVxcblxcbi5leHBsb3Npb24ge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogNTAlO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xcbiAgYW5pbWF0aW9uOiBvc2NpbGxhdGUgMS43NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbiAgei1pbmRleDogMTtcXG59XFxuXFxuLmZvcm0tY29udGFpbmVyIHtcXG4gIHBhZGRpbmc6IDE1cHg7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoIzAwNTM3NzNiLCAjZjFhMzA4YjApO1xcbn1cXG5cXG4uZm9ybS1oZWFkZXIge1xcbiAgZm9udC1zaXplOiAycmVtO1xcbiAgcGFkZGluZzogOHB4O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGNvbG9yOiAjNzQwODAwO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XFxufVxcblxcbmZvcm0ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtd3JhcDogd3JhcDtcXG4gIGdhcDogMTVweDtcXG4gIHBhZGRpbmc6IDE1cHg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxufVxcblxcbmZvcm0gPiBkaXYge1xcbiAgZmxleDogMCAxIDQ0MHB4O1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIHBhZGRpbmc6IDRweDtcXG4gIGdhcDogMTBweDtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDFmciAyMHB4O1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG4gIHBhZGRpbmctcmlnaHQ6IDEwcHg7XFxuICBib3JkZXItcmlnaHQ6IDFweCBncmV5IGRvdHRlZDtcXG4gIGJvcmRlci1ib3R0b206IDFweCBncmV5IGRvdHRlZDtcXG59XFxuXFxuLmNhcnJpZXItY29udGFpbmVyIHtcXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNzQ3KTtcXG59XFxuXFxuLmJhdHRsZXNoaXAtY29udGFpbmVyIHtcXG4gIGNvbG9yOiByZ2JhKDAsIDg3LCA0LCAwLjc0Nyk7XFxufVxcblxcbi5jcnVpc2VyLWNvbnRhaW5lciB7XFxuICBjb2xvcjogcmdiYSgxOTksIDAsIDAsIDAuNzQ3KTtcXG59XFxuXFxuLnN1Ym1hcmluZS1jb250YWluZXIge1xcbiAgY29sb3I6IHJnYmEoMTcsIDAsIDE3MywgMC43NDcpO1xcbn1cXG5cXG4uZGVzdHJveWVyLWNvbnRhaW5lciB7XFxuICBjb2xvcjogcmdiYSgxMjYsIDAsIDExOSwgMC43NDcpO1xcbn1cXG5cXG5mb3JtID4gZGl2ID4gZGl2IHtcXG4gIGZvbnQtc2l6ZTogMS44cmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbiAgcGFkZGluZy1yaWdodDogMTBweDtcXG4gIGdyaWQtYXJlYTogMSAvIDEgLyAyIC8gMjtcXG59XFxuXFxuc2VsZWN0IHtcXG4gIHdpZHRoOiBtaW4tY29udGVudDtcXG4gIGp1c3RpZnktc2VsZjogZW5kO1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbiAgcGFkZGluZzogNHB4O1xcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xcbiAgZ3JpZC1hcmVhOiAxIC8gMiAvIDIgLyA0O1xcbn1cXG5cXG5sYWJlbCB7XFxuICBmb250LXNpemU6IDFyZW07XFxuICBqdXN0aWZ5LXNlbGY6IGVuZDtcXG4gIGdyaWQtYXJlYTogMiAvIDIgLyAzIC8gMztcXG59XFxuXFxuaW5wdXRbdHlwZT1cXFwidGV4dFxcXCJdIHtcXG4gIHBhZGRpbmc6IDRweDtcXG4gIHdpZHRoOiA0MHB4O1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbiAganVzdGlmeS1zZWxmOiBlbmQ7XFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxuICBncmlkLWFyZWE6IDIgLyAzIC8gMyAvIDQ7XFxufVxcblxcbi5lcnJvciB7XFxuICBmb250LXNpemU6IDE2cHg7XFxuICBjb2xvcjogcmVkO1xcbiAgZ3JpZC1hcmVhOiAzIC8gMSAvIDQgLyA0O1xcbn1cXG5cXG4uYnV0dG9ucyB7XFxuICB3aWR0aDogNDAwcHg7XFxuICBoZWlnaHQ6IG1pbi1jb250ZW50O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtd3JhcDogd3JhcDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgYm9yZGVyOiBub25lO1xcbn1cXG5cXG4jcGxheS1nYW1lLWJ0bixcXG4jcmVzZXQtZ2FtZS1idG4ge1xcbiAgcGFkZGluZzogMTBweCAyMHB4O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG4gIGZvbnQtc2l6ZTogMnJlbTtcXG4gIGJvcmRlcjogMXB4IGJsYWNrIHNvbGlkO1xcbiAgYm9yZGVyLXJhZGl1czogMTVweDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIG1hcmdpbjogNXB4O1xcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjNzIGVhc2U7XFxufVxcblxcbiNwbGF5LWdhbWUtYnRuIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwNTJmNWY7XFxuICBjb2xvcjogd2hpdGU7XFxufVxcblxcbiNwbGF5LWdhbWUtYnRuOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDUzNzc7XFxufVxcblxcbiNyZXNldC1nYW1lLWJ0biB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjQ0MzM2O1xcbiAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4jcmVzZXQtZ2FtZS1idG46aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2RhMTkwYjtcXG59XFxuXFxuI3BsYXktZ2FtZS1idG46YWN0aXZlLFxcbiNyZXNldC1nYW1lLWJ0bjphY3RpdmUge1xcbiAgdHJhbnNmb3JtOiBzY2FsZSgwLjk1KTtcXG59XFxuXFxuLmdhbWVib2FyZHMge1xcbiAgbWFyZ2luLXRvcDogMjVweDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiBtaW4tY29udGVudDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBjb2x1bW4tZ2FwOiAxMHZ3O1xcbiAgcm93LWdhcDogMjVweDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbn1cXG5cXG4uZ2FtZWJvYXJkIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBnYXA6IDBweDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDExLCAzMnB4KTtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDExLCAzMnB4KTtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgbWFyZ2luLWJvdHRvbTogMjRweDtcXG59XFxuXFxuLmNvbHVtbi1udW1iZXIsXFxuLnJvdy1sZXR0ZXIge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1zaXplOiAyMHB4O1xcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xcbn1cXG5cXG4uZ2FtZXRpbGUge1xcbiAgd2lkdGg6IDMycHg7XFxuICBoZWlnaHQ6IDMycHg7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDZhNzdkO1xcbn1cXG5cXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDc2OHB4KSB7XFxuICAuZ2FtZWJvYXJkIHtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTEsIDU2cHgpO1xcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMSwgNTZweCk7XFxuICB9XFxuXFxuICAuY29sdW1uLW51bWJlcixcXG4gIC5yb3ctbGV0dGVyIHtcXG4gICAgZm9udC1zaXplOiAzMHB4O1xcbiAgfVxcblxcbiAgLmdhbWV0aWxlIHtcXG4gICAgd2lkdGg6IDU2cHg7XFxuICAgIGhlaWdodDogNTZweDtcXG4gIH1cXG59XFxuXFxuLmNhcnJpZXIsXFxuLmJhdHRsZXNoaXAsXFxuLmNydWlzZXIsXFxuLnN1Ym1hcmluZSxcXG4uZGVzdHJveWVyIHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGdyZXk7XFxufVxcblxcbi5jYXJyaWVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43NDcpO1xcbn1cXG5cXG4uYmF0dGxlc2hpcCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDg3LCA0LCAwLjc0Nyk7XFxufVxcblxcbi5jcnVpc2VyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTk5LCAwLCAwLCAwLjc0Nyk7XFxufVxcblxcbi5zdWJtYXJpbmUge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxNywgMCwgMTczLCAwLjc0Nyk7XFxufVxcblxcbi5kZXN0cm95ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxMjYsIDAsIDExOSwgMC43NDcpO1xcbn1cXG5cXG4uaGl0OjphZnRlciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBjb250ZW50OiBcXFwi8J+Or1xcXCI7XFxuICB0b3A6IDUwJTtcXG4gIGxlZnQ6IDUwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgZm9udC1zaXplOiAyNHB4O1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblxcbi5taXNzOjphZnRlciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBjb250ZW50OiBcXFwi4q2VXFxcIjtcXG4gIHRvcDogNTAlO1xcbiAgbGVmdDogNTAlO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICBmb250LXNpemU6IDI0cHg7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuXFxuLm1pc3MsXFxuLmhpdCB7XFxuICBjdXJzb3I6IGF1dG87XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xub3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL2NsYXNzZXMuanNcIjtcbmltcG9ydCB7IERPTSB9IGZyb20gXCIuL0RPTS5qc1wiO1xuXG5jb25zdCBwbGF5ZXJPbmUgPSBuZXcgUGxheWVyKFwicGxheWVyT25lXCIsIFwiaHVtYW5cIik7XG5jb25zdCBwbGF5ZXJUd28gPSBuZXcgUGxheWVyKFwicGxheWVyVHdvXCIsIFwiQUlcIik7XG5cbkRPTS5wcmVHYW1lKHBsYXllck9uZSwgcGxheWVyVHdvKTtcblxuLy8gUEMgdnMgY29tcHV0ZXJcbi8vIHN0YXRlOiBQQyBib2FyZCBpcyBhbHdheXMgdmlzaWJsZVxuLy8gc3RhdGU6IGNvbXB1dGVyIGJvYXJkIGlzIG5ldmVyIHZpc2libGVcbi8vIGFsdGVybmF0aW5nIHN0YXRlOiBwbGF5ZXIgcGlja3MgYSBzcG90IHRvIGF0dGFjaywgYXR0YWNrcywgY2hlY2sgZm9yIHdpbiwgdGhlbiBjb21wdXRlciB0dXJuXG4vLyBjb21wdXRlciBhdHRhY2tzLCBjaGVjayBmb3Igd2luLCB0aGVuIHBjIGF0dGFja3NcbiJdLCJuYW1lcyI6WyJET00iLCJwbGF5ZXJBdHRhY2tGbiIsImF0dGFja2luZ1BsYXllciIsImRlZmVuZGluZ1BsYXllciIsImV2ZW50IiwiZGVmZW5kaW5nQm9hcmQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJwbGF5ZXJOdW1iZXIiLCJnYW1ldGlsZSIsInRhcmdldCIsImNvb3JkaW5hdGVBcnJheSIsInNwbGl0Q29vcmRpbmF0ZXMiLCJkYXRhc2V0IiwiY29vcmRpbmF0ZSIsImdhbWVib2FyZCIsInJlY2VpdmVBdHRhY2siLCJyZW5kZXJIaXRzIiwicmVuZGVyTWlzc2VzIiwiY2hlY2tGb3JXaW4iLCJzZXRUaW1lb3V0IiwiYWxlcnQiLCJjbGljayIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJib3VuZFBsYXllckF0dGFja0ZuIiwic3R5bGUiLCJjdXJzb3IiLCJwb2ludGVyRXZlbnRzIiwiY29tcHV0ZXJzVHVybiIsInByZXBCb2FyZEZvckF0dGFja0NsaWNrRXZlbnRzIiwiZGVmZW5kaW5nVGlsZXMiLCJBcnJheSIsImZyb20iLCJxdWVyeVNlbGVjdG9yQWxsIiwiYmluZCIsImZvckVhY2giLCJhZGRFdmVudExpc3RlbmVyIiwicmVuZGVyUGxheWVyQm9hcmRzIiwicGxheWVyT25lIiwicGxheWVyVHdvIiwicmVuZGVyU2hpcHMiLCJwbGF5ZXIiLCJib2FyZCIsInNoaXBMb2NhdGlvbnMiLCJsaXN0R3JpZENlbGxzV2l0aEFzc29jaWF0ZWRTaGlwIiwic2hpcExvY2F0aW9uIiwiZ3JpZENlbGwiLCJjbGFzc0xpc3QiLCJhZGQiLCJoaXRzIiwiY29tYmluZUNvb3JkaW5hdGVzIiwiaGl0IiwibWlzc2VzIiwibWlzcyIsImh1bWFuUGxheWVyIiwiY29tcHV0ZXJQbGF5ZXIiLCJjb21wdXRlcnNBdHRhY2tDb29yZGluYXRlcyIsIkFJQXR0YWNrIiwiYWxsU2hpcHNTdW5rIiwicHJlR2FtZSIsInBsYXlHYW1lRm9ybSIsInBsYXlCdG4iLCJyZXNldEJ0biIsInNoaXBUeXBlcyIsImxpc3RTaGlwVHlwZXMiLCJwbGFjZVNoaXBzRm4iLCJyZW1vdmVBbGxTaGlwcyIsImNsZWFyQm9hcmRzIiwiZXJyb3IiLCJwcmV2ZW50RGVmYXVsdCIsImNoZWNrVmFsaWRpdHkiLCJyZXBvcnRWYWxpZGl0eSIsInNoaXAiLCJjb29yZGluYXRlSW5wdXQiLCJvcmllbnRhdGlvbklucHV0IiwiZXJyb3JTcGFuIiwicmF3Q29vcmRpbmF0ZXMiLCJ2YWx1ZSIsInVwZGF0ZWRDb29yZGluYXRlcyIsIm9yaWVudGF0aW9uIiwidGV4dENvbnRlbnQiLCJzaGlwUGxhY2VtZW50V29ya2VkIiwicGxhY2VTaGlwIiwic2xpY2UiLCJ0b1VwcGVyQ2FzZSIsImRpc2FibGVkIiwicmFuZG9taXplU2hpcHMiLCJjb29yZElucHV0Iiwic2V0Q3VzdG9tVmFsaWRpdHkiLCJyZXNldEdhbWVGbiIsInJlc2V0IiwiZ2FtZVRpbGVzIiwiY2xhc3NOYW1lIiwiYXJyYXkiLCJuZXdBcnJheSIsImNvb3JkaW5hdGVQYWlyIiwicHVzaCIsImF0IiwiU2hpcCIsImNvbnN0cnVjdG9yIiwibGVuZ3RoIiwic3VuayIsImlzU3VuayIsIkdhbWVib2FyZCIsImNhcnJpZXIiLCJjb29yZGluYXRlcyIsImJhdHRsZXNoaXAiLCJjcnVpc2VyIiwic3VibWFyaW5lIiwiZGVzdHJveWVyIiwibGV0dGVyQ29vcmRpbmF0ZSIsIm51bWJlckNvb3JkaW5hdGUiLCJzaGlwVHlwZSIsInVwcGVyY2FzZUxldHRlckNvb3JkaW5hdGUiLCJhbGxvd2VkTGV0dGVycyIsImxldHRlckluZGV4IiwiaW5kZXhPZiIsInNoaXBMZW5ndGgiLCJzaGlwQ29vcmRpbmF0ZXMiLCJleGlzdGluZ0Nvb3JkaW5hdGVzIiwibGlzdFNoaXBMb2NhdGlvbnMiLCJpIiwibmV3Q29vcmRpbmF0ZSIsIm9sZENvb3JkaW5hdGUiLCJwbGFjZWQiLCJhdHRlbXB0cyIsIm1heEF0dGVtcHRzIiwiaG9yaXpvbnRhbCIsImdhbWVib2FyZENvb3JkaW5hdGVzIiwidmVydGljYWwiLCJNYXRoIiwicmFuZG9tIiwicmFuZG9tSW5kZXgiLCJmbG9vciIsInJhbmRvbUNvb3JkaW5hdGUiLCJzcGxpY2UiLCJjb25zb2xlIiwibG9nIiwicmVtb3ZlU2hpcCIsImNvbmNhdCIsInBsYWNlZFNoaXBzIiwiYWxsU2hpcFR5cGVzIiwiYWxsU2hpcHNQbGFjZWQiLCJudW1iZXJPZlN1bmtlblNoaXBzIiwiUGxheWVyIiwidHlwZSIsIl9wbGFjZXNUb0F0dGFjayJdLCJzb3VyY2VSb290IjoiIn0=