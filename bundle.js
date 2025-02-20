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
    return numberOfSunkenShips === this.placedShips();
  }
  gameboardCoordinates() {
    const letters = "ABCDEFGHIJ".split("");
    return letters.flatMap(letter => Array.from({
      length: 10
    }, (_, index) => [letter, index + 1]));
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

:root {
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

body {
  font-family: monospace;
  display: flex;
  flex-direction: column;
  max-width: 1500px;
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

.instructions {
  font-size: 1rem;
  padding: 4px;
  font-weight: bolder;
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
  justify-content: center;
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

footer {
  text-align: center;
  margin-top: auto;
  padding: 2rem;
  font-size: 3rem;
  color: white;
  background-color: rgb(0, 0, 0);
}
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["html,\nbody,\ndiv,\nspan,\napplet,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\nsmall,\nstrike,\nstrong,\nsub,\nsup,\ntt,\nvar,\nb,\nu,\ni,\ncenter,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\narticle,\naside,\ncanvas,\ndetails,\nembed,\nfigure,\nfigcaption,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\noutput,\nruby,\nsection,\nsummary,\ntime,\nmark,\naudio,\nvideo {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline;\n}\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection {\n  display: block;\n}\nbody {\n  line-height: 1;\n}\nol,\nul {\n  list-style: none;\n}\nblockquote,\nq {\n  quotes: none;\n}\nblockquote:before,\nblockquote:after,\nq:before,\nq:after {\n  content: \"\";\n  content: none;\n}\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\n:root {\n  display: flex;\n  justify-content: center;\n  min-height: 100vh;\n}\n\nbody {\n  font-family: monospace;\n  display: flex;\n  flex-direction: column;\n  max-width: 1500px;\n}\n\nheader {\n  background-image: linear-gradient(#052f5f, #005377);\n  color: white;\n  font-size: 4rem;\n  padding: 1rem;\n  text-align: center;\n  font-weight: bolder;\n}\n\nheader > span {\n  position: relative;\n  display: inline-block;\n}\n\n@keyframes oscillate {\n  from {\n    transform: translateX(-50%) scale(0);\n    opacity: 0.3;\n  }\n  to {\n    transform: translateX(-50%) scale(1);\n    opacity: 0.8;\n  }\n}\n\n.explosion {\n  position: absolute;\n  top: 0;\n  left: 50%;\n  transform: translateX(-50%);\n  animation: oscillate 1.75s infinite alternate;\n  z-index: 1;\n}\n\n.form-container {\n  padding: 15px;\n  background-image: linear-gradient(#0053773b, #f1a308b0);\n}\n\n.instructions {\n  font-size: 1rem;\n  padding: 4px;\n  font-weight: bolder;\n}\n\n.form-header {\n  font-size: 2rem;\n  padding: 8px;\n  font-weight: bolder;\n  text-align: center;\n  color: #740800;\n  text-decoration: underline;\n}\n\nform {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 15px;\n  padding: 15px;\n  justify-content: center;\n  align-items: center;\n  font-size: 1.5rem;\n}\n\nform > div {\n  flex: 0 1 440px;\n  display: grid;\n  padding: 4px;\n  gap: 10px;\n  grid-template-rows: 1fr 1fr 20px;\n  place-items: center;\n  padding-right: 10px;\n  border-right: 1px grey dotted;\n  border-bottom: 1px grey dotted;\n}\n\n.carrier-container {\n  color: rgba(0, 0, 0, 0.747);\n}\n\n.battleship-container {\n  color: rgba(0, 87, 4, 0.747);\n}\n\n.cruiser-container {\n  color: rgba(199, 0, 0, 0.747);\n}\n\n.submarine-container {\n  color: rgba(17, 0, 173, 0.747);\n}\n\n.destroyer-container {\n  color: rgba(126, 0, 119, 0.747);\n}\n\nform > div > div {\n  font-size: 1.8rem;\n  font-weight: bold;\n  text-align: left;\n  padding-right: 10px;\n  grid-area: 1 / 1 / 2 / 2;\n}\n\nselect {\n  width: min-content;\n  justify-self: end;\n  font-size: 1rem;\n  padding: 4px;\n  border-radius: 4px;\n  grid-area: 1 / 2 / 2 / 4;\n}\n\nlabel {\n  font-size: 1rem;\n  justify-self: end;\n  grid-area: 2 / 2 / 3 / 3;\n}\n\ninput[type=\"text\"] {\n  padding: 4px;\n  width: 40px;\n  font-size: 1rem;\n  justify-self: end;\n  border-radius: 4px;\n  grid-area: 2 / 3 / 3 / 4;\n}\n\n.error {\n  font-size: 16px;\n  color: red;\n  grid-area: 3 / 1 / 4 / 4;\n}\n\n.buttons {\n  width: 400px;\n  height: min-content;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-around;\n  border: none;\n}\n\n#play-game-btn,\n#reset-game-btn {\n  padding: 10px 20px;\n  font-weight: bolder;\n  font-size: 2rem;\n  border: 1px black solid;\n  border-radius: 15px;\n  cursor: pointer;\n  margin: 5px;\n  transition: background-color 0.3s ease;\n}\n\n#play-game-btn {\n  background-color: #052f5f;\n  color: white;\n}\n\n#play-game-btn:hover {\n  background-color: #005377;\n}\n\n#reset-game-btn {\n  background-color: #f44336;\n  color: white;\n}\n\n#reset-game-btn:hover {\n  background-color: #da190b;\n}\n\n#play-game-btn:active,\n#reset-game-btn:active {\n  transform: scale(0.95);\n}\n\n.gameboards {\n  margin-top: 25px;\n  width: 100%;\n  height: min-content;\n  display: flex;\n  column-gap: 10vw;\n  row-gap: 25px;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n\n.gameboard {\n  display: grid;\n  gap: 0px;\n  grid-template-columns: repeat(11, 32px);\n  grid-template-rows: repeat(11, 32px);\n  justify-content: center;\n  margin-bottom: 24px;\n}\n\n.column-number,\n.row-letter {\n  text-align: center;\n  font-size: 20px;\n  align-self: center;\n}\n\n.gametile {\n  width: 32px;\n  height: 32px;\n  border: 1px solid black;\n  position: relative;\n  box-sizing: border-box;\n  background-color: #06a77d;\n}\n\n@media only screen and (min-width: 768px) {\n  .gameboard {\n    grid-template-columns: repeat(11, 56px);\n    grid-template-rows: repeat(11, 56px);\n  }\n\n  .column-number,\n  .row-letter {\n    font-size: 30px;\n  }\n\n  .gametile {\n    width: 56px;\n    height: 56px;\n  }\n}\n\n.carrier,\n.battleship,\n.cruiser,\n.submarine,\n.destroyer {\n  border: 1px solid grey;\n}\n\n.carrier {\n  background-color: rgba(0, 0, 0, 0.747);\n}\n\n.battleship {\n  background-color: rgba(0, 87, 4, 0.747);\n}\n\n.cruiser {\n  background-color: rgba(199, 0, 0, 0.747);\n}\n\n.submarine {\n  background-color: rgba(17, 0, 173, 0.747);\n}\n\n.destroyer {\n  background-color: rgba(126, 0, 119, 0.747);\n}\n\n.hit::after {\n  position: absolute;\n  content: \"🎯\";\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 24px;\n  pointer-events: none;\n}\n\n.miss::after {\n  position: absolute;\n  content: \"⭕\";\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 24px;\n  pointer-events: none;\n}\n\n.miss,\n.hit {\n  cursor: auto;\n}\n\nfooter {\n  text-align: center;\n  margin-top: auto;\n  padding: 2rem;\n  font-size: 3rem;\n  color: white;\n  background-color: rgb(0, 0, 0);\n}\n"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sZ0tBQWdLLFdBQVcsVUFBVSxVQUFVLFVBQVUsVUFBVSxZQUFZLE1BQU0sZUFBZSxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxVQUFVLEtBQUssUUFBUSxVQUFVLFVBQVUsS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLEtBQUssWUFBWSxXQUFXLEtBQUssS0FBSyxZQUFZLFdBQVcsS0FBSyxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsWUFBWSxhQUFhLFdBQVcsTUFBTSxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsV0FBVyxZQUFZLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxPQUFP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QUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUNiQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7Ozs7Ozs7Ozs7QUNBcUI7QUFDaUI7QUFDUDtBQUUvQixNQUFNMUYsU0FBUyxHQUFHLElBQUk4RywrQ0FBTSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUM7QUFDbEQsTUFBTTdHLFNBQVMsR0FBRyxJQUFJNkcsK0NBQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDO0FBRS9DcEosd0NBQUcsQ0FBQzJELE9BQU8sQ0FBQ3JCLFNBQVMsRUFBRUMsU0FBUyxDQUFDOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL3NyYy9ET00uanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL3NyYy9jbGFzc2VzLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3RlbXBsYXRlLTEvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3RlbXBsYXRlLTEvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RlbXBsYXRlLTEvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90ZW1wbGF0ZS0xL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUtMS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBET00ge1xuICBzdGF0aWMgcGxheWVyQXR0YWNrRm4oYXR0YWNraW5nUGxheWVyLCBkZWZlbmRpbmdQbGF5ZXIsIGV2ZW50KSB7XG4gICAgY29uc3QgZGVmZW5kaW5nQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgYC4ke2RlZmVuZGluZ1BsYXllci5wbGF5ZXJOdW1iZXJ9YCxcbiAgICApO1xuICAgIGNvbnN0IGdhbWV0aWxlID0gZXZlbnQudGFyZ2V0O1xuICAgIGNvbnN0IGNvb3JkaW5hdGVBcnJheSA9IERPTS5zcGxpdENvb3JkaW5hdGVzKGdhbWV0aWxlLmRhdGFzZXQuY29vcmRpbmF0ZSk7XG5cbiAgICBkZWZlbmRpbmdQbGF5ZXIuZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soXG4gICAgICBjb29yZGluYXRlQXJyYXlbMF0sXG4gICAgICBjb29yZGluYXRlQXJyYXlbMV0sXG4gICAgKTtcbiAgICBET00ucmVuZGVySGl0cyhkZWZlbmRpbmdQbGF5ZXIpO1xuICAgIERPTS5yZW5kZXJNaXNzZXMoZGVmZW5kaW5nUGxheWVyKTtcblxuICAgIGlmIChET00uY2hlY2tGb3JXaW4oZGVmZW5kaW5nUGxheWVyKSkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFsZXJ0KFwiWW91IHdpbiEhXCIpO1xuICAgICAgfSwgMCk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZXNldC1nYW1lLWJ0blwiKS5jbGljaygpO1xuICAgICAgfSwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdhbWV0aWxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBnYW1ldGlsZS5ib3VuZFBsYXllckF0dGFja0ZuKTtcbiAgICAgIGRlbGV0ZSBnYW1ldGlsZS5ib3VuZFBsYXllckF0dGFja0ZuOyAvL1xuICAgICAgZ2FtZXRpbGUuc3R5bGUuY3Vyc29yID0gXCJhdXRvXCI7XG4gICAgICBkZWZlbmRpbmdCb2FyZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICBET00uY29tcHV0ZXJzVHVybihhdHRhY2tpbmdQbGF5ZXIsIGRlZmVuZGluZ1BsYXllcik7XG4gICAgICBkZWZlbmRpbmdCb2FyZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJhdXRvXCI7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHByZXBCb2FyZEZvckF0dGFja0NsaWNrRXZlbnRzKGF0dGFja2luZ1BsYXllciwgZGVmZW5kaW5nUGxheWVyKSB7XG4gICAgY29uc3QgZGVmZW5kaW5nQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgYC4ke2RlZmVuZGluZ1BsYXllci5wbGF5ZXJOdW1iZXJ9YCxcbiAgICApO1xuICAgIGNvbnN0IGRlZmVuZGluZ1RpbGVzID0gQXJyYXkuZnJvbShcbiAgICAgIGRlZmVuZGluZ0JvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZXRpbGVcIiksXG4gICAgKTtcblxuICAgIGNvbnN0IGJvdW5kUGxheWVyQXR0YWNrRm4gPSB0aGlzLnBsYXllckF0dGFja0ZuLmJpbmQoXG4gICAgICB0aGlzLFxuICAgICAgYXR0YWNraW5nUGxheWVyLFxuICAgICAgZGVmZW5kaW5nUGxheWVyLFxuICAgICk7XG5cbiAgICBkZWZlbmRpbmdUaWxlcy5mb3JFYWNoKChnYW1ldGlsZSkgPT4ge1xuICAgICAgZ2FtZXRpbGUuc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG4gICAgICBnYW1ldGlsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYm91bmRQbGF5ZXJBdHRhY2tGbik7XG4gICAgICBnYW1ldGlsZS5ib3VuZFBsYXllckF0dGFja0ZuID0gYm91bmRQbGF5ZXJBdHRhY2tGbjtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyByZW5kZXJQbGF5ZXJCb2FyZHMocGxheWVyT25lLCBwbGF5ZXJUd28pIHtcbiAgICB0aGlzLnJlbmRlclNoaXBzKHBsYXllck9uZSk7XG4gICAgdGhpcy5yZW5kZXJIaXRzKHBsYXllck9uZSk7XG4gICAgdGhpcy5yZW5kZXJNaXNzZXMocGxheWVyT25lKTtcblxuICAgIHRoaXMucmVuZGVySGl0cyhwbGF5ZXJUd28pO1xuICAgIHRoaXMucmVuZGVyTWlzc2VzKHBsYXllclR3byk7XG4gICAgdGhpcy5wcmVwQm9hcmRGb3JBdHRhY2tDbGlja0V2ZW50cyhwbGF5ZXJPbmUsIHBsYXllclR3byk7XG4gIH1cblxuICBzdGF0aWMgcmVuZGVyU2hpcHMocGxheWVyKSB7XG4gICAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtwbGF5ZXIucGxheWVyTnVtYmVyfWApO1xuICAgIGNvbnN0IHNoaXBMb2NhdGlvbnMgPSBwbGF5ZXIuZ2FtZWJvYXJkLmxpc3RHcmlkQ2VsbHNXaXRoQXNzb2NpYXRlZFNoaXAoKTtcblxuICAgIHNoaXBMb2NhdGlvbnMuZm9yRWFjaCgoc2hpcExvY2F0aW9uKSA9PiB7XG4gICAgICBjb25zdCBncmlkQ2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS1jb29yZGluYXRlPVwiJHtzaGlwTG9jYXRpb25bMF19XCJdYCxcbiAgICAgICk7XG4gICAgICBncmlkQ2VsbC5jbGFzc0xpc3QuYWRkKGAke3NoaXBMb2NhdGlvblsxXX1gKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyByZW5kZXJIaXRzKHBsYXllcikge1xuICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7cGxheWVyLnBsYXllck51bWJlcn1gKTtcbiAgICBjb25zdCBoaXRzID0gdGhpcy5jb21iaW5lQ29vcmRpbmF0ZXMocGxheWVyLmdhbWVib2FyZC5oaXRzKTtcblxuICAgIGhpdHMuZm9yRWFjaCgoaGl0KSA9PiB7XG4gICAgICBjb25zdCBncmlkQ2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvb3JkaW5hdGU9XCIke2hpdH1cIl1gKTtcblxuICAgICAgZ3JpZENlbGwuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyByZW5kZXJNaXNzZXMocGxheWVyKSB7XG4gICAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtwbGF5ZXIucGxheWVyTnVtYmVyfWApO1xuICAgIGNvbnN0IG1pc3NlcyA9IHRoaXMuY29tYmluZUNvb3JkaW5hdGVzKHBsYXllci5nYW1lYm9hcmQubWlzc2VzKTtcblxuICAgIG1pc3Nlcy5mb3JFYWNoKChtaXNzKSA9PiB7XG4gICAgICBjb25zdCBncmlkQ2VsbCA9IGJvYXJkLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvb3JkaW5hdGU9XCIke21pc3N9XCJdYCk7XG5cbiAgICAgIGdyaWRDZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGNvbXB1dGVyc1R1cm4oaHVtYW5QbGF5ZXIsIGNvbXB1dGVyUGxheWVyKSB7XG4gICAgY29uc3QgY29tcHV0ZXJzQXR0YWNrQ29vcmRpbmF0ZXMgPSBjb21wdXRlclBsYXllci5BSUF0dGFjaygpO1xuICAgIGh1bWFuUGxheWVyLmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKFxuICAgICAgY29tcHV0ZXJzQXR0YWNrQ29vcmRpbmF0ZXNbMF0sXG4gICAgICBjb21wdXRlcnNBdHRhY2tDb29yZGluYXRlc1sxXSAqIDEsXG4gICAgKTtcbiAgICB0aGlzLnJlbmRlckhpdHMoaHVtYW5QbGF5ZXIpO1xuICAgIHRoaXMucmVuZGVyTWlzc2VzKGh1bWFuUGxheWVyKTtcbiAgICBpZiAodGhpcy5jaGVja0ZvcldpbihodW1hblBsYXllcikpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBhbGVydChcIkJldHRlciBsdWNrIG5leHQgdGltZSFcIik7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY2hlY2tGb3JXaW4ocGxheWVyKSB7XG4gICAgaWYgKHBsYXllci5nYW1lYm9hcmQuYWxsU2hpcHNTdW5rKCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdGF0aWMgcHJlR2FtZShwbGF5ZXJPbmUsIHBsYXllclR3bykge1xuICAgIGNvbnN0IHBsYXlHYW1lRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheWVyLW9uZS1mb3JtXCIpO1xuICAgIGNvbnN0IHBsYXlCdG4gPSBwbGF5R2FtZUZvcm0ucXVlcnlTZWxlY3RvcihcIiNwbGF5LWdhbWUtYnRuXCIpO1xuICAgIGNvbnN0IHJlc2V0QnRuID0gcGxheUdhbWVGb3JtLnF1ZXJ5U2VsZWN0b3IoXCIjcmVzZXQtZ2FtZS1idG5cIik7XG5cbiAgICBjb25zdCBzaGlwVHlwZXMgPSBwbGF5ZXJPbmUuZ2FtZWJvYXJkLmxpc3RTaGlwVHlwZXMoKTtcblxuICAgIGNvbnN0IHBsYWNlU2hpcHNGbiA9IChldmVudCkgPT4ge1xuICAgICAgcGxheWVyT25lLmdhbWVib2FyZC5yZW1vdmVBbGxTaGlwcygpO1xuICAgICAgRE9NLmNsZWFyQm9hcmRzKCk7XG4gICAgICBsZXQgZXJyb3IgPSBmYWxzZTtcblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmICghcGxheUdhbWVGb3JtLmNoZWNrVmFsaWRpdHkoKSkge1xuICAgICAgICBwbGF5R2FtZUZvcm0ucmVwb3J0VmFsaWRpdHkoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBUeXBlcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgICAgY29uc3QgY29vcmRpbmF0ZUlucHV0ID0gcGxheUdhbWVGb3JtLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICBgIyR7c2hpcH0tY29vcmRpbmF0ZXNgLFxuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc3Qgb3JpZW50YXRpb25JbnB1dCA9IHBsYXlHYW1lRm9ybS5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgYCMke3NoaXB9LW9yaWVudGF0aW9uYCxcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbnN0IGVycm9yU3BhbiA9IHBsYXlHYW1lRm9ybS5xdWVyeVNlbGVjdG9yKGAuJHtzaGlwfS1lcnJvci1zcGFuYCk7XG5cbiAgICAgICAgICBjb25zdCByYXdDb29yZGluYXRlcyA9IGNvb3JkaW5hdGVJbnB1dC52YWx1ZTtcbiAgICAgICAgICBjb25zdCB1cGRhdGVkQ29vcmRpbmF0ZXMgPSBET00uc3BsaXRDb29yZGluYXRlcyhyYXdDb29yZGluYXRlcyk7XG4gICAgICAgICAgY29uc3Qgb3JpZW50YXRpb24gPSBvcmllbnRhdGlvbklucHV0LnZhbHVlO1xuICAgICAgICAgIGVycm9yU3Bhbi50ZXh0Q29udGVudCA9IFwiXCI7XG5cbiAgICAgICAgICBjb25zdCBzaGlwUGxhY2VtZW50V29ya2VkID0gcGxheWVyT25lLmdhbWVib2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICAgICB1cGRhdGVkQ29vcmRpbmF0ZXNbMF0sXG4gICAgICAgICAgICB1cGRhdGVkQ29vcmRpbmF0ZXNbMV0sXG4gICAgICAgICAgICBvcmllbnRhdGlvbixcbiAgICAgICAgICAgIHNoaXAsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoc2hpcFBsYWNlbWVudFdvcmtlZCAhPT0gXCJwbGFjZWRcIikge1xuICAgICAgICAgICAgZXJyb3JTcGFuLnRleHRDb250ZW50ID0gYCR7c2hpcC5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpfSR7c2hpcC5zbGljZSgxKX0gaGFzIGFuIGVycm9yLiAke3NoaXBQbGFjZW1lbnRXb3JrZWR9YDtcbiAgICAgICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBET00ucmVuZGVyU2hpcHMocGxheWVyT25lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwbGF5QnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICBwbGF5ZXJUd28uZ2FtZWJvYXJkLnJhbmRvbWl6ZVNoaXBzKCk7XG4gICAgICAgICAgRE9NLnJlbmRlclBsYXllckJvYXJkcyhwbGF5ZXJPbmUsIHBsYXllclR3byk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheUdhbWVGb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgcGxhY2VTaGlwc0ZuKTtcblxuICAgIHNoaXBUeXBlcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBjb25zdCBjb29yZElucHV0ID0gcGxheUdhbWVGb3JtLnF1ZXJ5U2VsZWN0b3IoYCMke3NoaXB9LWNvb3JkaW5hdGVzYCk7XG5cbiAgICAgIC8vIENsZWFyIGN1c3RvbSB2YWxpZGl0eSBvbiBjb29yZGluYXRlIGlucHV0XG4gICAgICBjb29yZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XG4gICAgICAgIGNvb3JkSW5wdXQuc2V0Q3VzdG9tVmFsaWRpdHkoXCJcIik7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc2V0R2FtZUZuID0gKCkgPT4ge1xuICAgICAgcGxheWVyT25lLnJlc2V0KCk7XG4gICAgICBwbGF5ZXJUd28ucmVzZXQoKTtcbiAgICAgIERPTS5jbGVhckJvYXJkcygpO1xuICAgICAgcGxheUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH07XG5cbiAgICByZXNldEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVzZXRHYW1lRm4pO1xuICB9XG5cbiAgc3RhdGljIGNsZWFyQm9hcmRzKCkge1xuICAgIGNvbnN0IGdhbWVUaWxlcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5nYW1ldGlsZVwiKSk7XG5cbiAgICBnYW1lVGlsZXMuZm9yRWFjaCgoZ2FtZXRpbGUpID0+IHtcbiAgICAgIGdhbWV0aWxlLmNsYXNzTmFtZSA9IFwiZ2FtZXRpbGVcIjtcbiAgICAgIGdhbWV0aWxlLnN0eWxlLmN1cnNvciA9IFwiYXV0b1wiO1xuXG4gICAgICBpZiAoZ2FtZXRpbGUuYm91bmRQbGF5ZXJBdHRhY2tGbikge1xuICAgICAgICBnYW1ldGlsZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZ2FtZXRpbGUuYm91bmRQbGF5ZXJBdHRhY2tGbik7XG4gICAgICAgIGRlbGV0ZSBnYW1ldGlsZS5ib3VuZFBsYXllckF0dGFja0ZuO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gICBoZWxwZXIgZnVuY3Rpb25zIGZvciB0cmFuc2Zvcm1pbmcgY29vcmRpbmF0ZXMgYXMgbmVlZGVkIGZvciB1c2UgaW4gZGF0YSBhdHRyaWJ1dGVzXG4gIHN0YXRpYyBjb21iaW5lQ29vcmRpbmF0ZXMoYXJyYXkpIHtcbiAgICBsZXQgbmV3QXJyYXkgPSBbXTtcbiAgICBhcnJheS5mb3JFYWNoKChjb29yZGluYXRlUGFpcikgPT4ge1xuICAgICAgbmV3QXJyYXkucHVzaChjb29yZGluYXRlUGFpclswXSArIGNvb3JkaW5hdGVQYWlyWzFdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3QXJyYXk7XG4gIH1cblxuICBzdGF0aWMgc3BsaXRDb29yZGluYXRlcyhjb29yZGluYXRlKSB7XG4gICAgcmV0dXJuIFtjb29yZGluYXRlLmF0KDApLCBjb29yZGluYXRlLnNsaWNlKDEpICogMV07XG4gIH1cbn1cblxuZXhwb3J0IHsgRE9NIH07XG4iLCIvLyBzdGFuZGFyZCBiYXR0bGVzaGlwIGhhcyA1IHNoaXBzXG4vLyAgY2FycmllciAoNSBob2xlcylcbi8vICBiYXR0bGVzaGlwICg0IGhvbGVzKVxuLy8gIGNydWlzZXIgKDMgaG9sZXMpXG4vLyAgc3VibWFyaW5lICgzIGhvbGVzKVxuLy8gIGRlc3Ryb3llciAoMiBob2xlcylcblxuY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKGxlbmd0aCkge1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMuaGl0cyA9IDA7XG4gICAgdGhpcy5zdW5rID0gZmFsc2U7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgdGhpcy5oaXRzKys7XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGl0cyA+PSB0aGlzLmxlbmd0aDtcbiAgfVxufVxuXG4vLyBHYW1lYm9hcmQgbGF5b3V0IHZpc3VhbCAoY2FsbGVkIG91dCBpbiBMRVRURVIsIE5VTUJFUiBmb3JtYXQpXG4vLyAgIDEgMiAzIDQgNSA2IDcgOCA5IDEwXG4vLyBBXG4vLyBCXG4vLyBDXG4vLyBEXG4vLyBFXG4vLyBGXG4vLyBHXG4vLyBIXG4vLyBJXG4vLyBKXG5cbmNsYXNzIEdhbWVib2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY2FycmllciA9IHtcbiAgICAgIHNoaXA6IG5ldyBTaGlwKDUpLFxuICAgICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgIH07XG4gICAgdGhpcy5iYXR0bGVzaGlwID0ge1xuICAgICAgc2hpcDogbmV3IFNoaXAoNCksXG4gICAgICBjb29yZGluYXRlczogW10sXG4gICAgfTtcbiAgICB0aGlzLmNydWlzZXIgPSB7XG4gICAgICBzaGlwOiBuZXcgU2hpcCgzKSxcbiAgICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICB9O1xuICAgIHRoaXMuc3VibWFyaW5lID0ge1xuICAgICAgc2hpcDogbmV3IFNoaXAoMyksXG4gICAgICBjb29yZGluYXRlczogW10sXG4gICAgfTtcbiAgICB0aGlzLmRlc3Ryb3llciA9IHtcbiAgICAgIHNoaXA6IG5ldyBTaGlwKDIpLFxuICAgICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgIH07XG4gICAgdGhpcy5oaXRzID0gW107XG4gICAgdGhpcy5taXNzZXMgPSBbXTtcbiAgfVxuXG4gIHBsYWNlU2hpcChsZXR0ZXJDb29yZGluYXRlLCBudW1iZXJDb29yZGluYXRlLCBvcmllbnRhdGlvbiwgc2hpcFR5cGUpIHtcbiAgICBsZXQgZXJyb3I7XG4gICAgY29uc3QgdXBwZXJjYXNlTGV0dGVyQ29vcmRpbmF0ZSA9IGxldHRlckNvb3JkaW5hdGUudG9VcHBlckNhc2UoKTtcbiAgICBjb25zdCBhbGxvd2VkTGV0dGVycyA9IFtcIkFcIiwgXCJCXCIsIFwiQ1wiLCBcIkRcIiwgXCJFXCIsIFwiRlwiLCBcIkdcIiwgXCJIXCIsIFwiSVwiLCBcIkpcIl07XG4gICAgY29uc3QgbGV0dGVySW5kZXggPSBhbGxvd2VkTGV0dGVycy5pbmRleE9mKHVwcGVyY2FzZUxldHRlckNvb3JkaW5hdGUpO1xuXG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IHRoaXNbc2hpcFR5cGVdLnNoaXAubGVuZ3RoO1xuICAgIGxldCBzaGlwQ29vcmRpbmF0ZXMgPSBbXTtcbiAgICBjb25zdCBleGlzdGluZ0Nvb3JkaW5hdGVzID0gdGhpcy5saXN0U2hpcExvY2F0aW9ucygpO1xuICAgIGxldCBwbGFjZVNoaXAgPSB0cnVlO1xuXG4gICAgaWYgKFxuICAgICAgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIiAmJiBzaGlwTGVuZ3RoICsgbnVtYmVyQ29vcmRpbmF0ZSA+IDExKSB8fFxuICAgICAgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIgJiYgc2hpcExlbmd0aCArIGxldHRlckluZGV4ID4gMTApIHx8XG4gICAgICBsZXR0ZXJJbmRleCA9PT0gLTEgfHxcbiAgICAgIG51bWJlckNvb3JkaW5hdGUgPCAxIHx8XG4gICAgICBudW1iZXJDb29yZGluYXRlID4gMTBcbiAgICApIHtcbiAgICAgIGVycm9yID0gXCJTaGlwcyBtdXN0IGJlIHBsYWNlZCBlbnRpcmVseSBvbiB0aGUgYm9hcmQuXCI7XG4gICAgICBwbGFjZVNoaXAgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgICBzaGlwQ29vcmRpbmF0ZXMucHVzaChbdXBwZXJjYXNlTGV0dGVyQ29vcmRpbmF0ZSwgbnVtYmVyQ29vcmRpbmF0ZSArIGldKTtcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgICBzaGlwQ29vcmRpbmF0ZXMucHVzaChbXG4gICAgICAgICAgYWxsb3dlZExldHRlcnNbbGV0dGVySW5kZXggKyBpXSxcbiAgICAgICAgICBudW1iZXJDb29yZGluYXRlLFxuICAgICAgICBdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaGlwQ29vcmRpbmF0ZXMuZm9yRWFjaCgobmV3Q29vcmRpbmF0ZSkgPT4ge1xuICAgICAgZXhpc3RpbmdDb29yZGluYXRlcy5mb3JFYWNoKChvbGRDb29yZGluYXRlKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBuZXdDb29yZGluYXRlWzBdID09PSBvbGRDb29yZGluYXRlWzBdICYmXG4gICAgICAgICAgbmV3Q29vcmRpbmF0ZVsxXSA9PT0gb2xkQ29vcmRpbmF0ZVsxXVxuICAgICAgICApIHtcbiAgICAgICAgICBwbGFjZVNoaXAgPSBmYWxzZTtcbiAgICAgICAgICBlcnJvciA9IFwiU2hpcHMgY2Fubm90IG92ZXJsYXAuXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaWYgKHBsYWNlU2hpcCkge1xuICAgICAgdGhpc1tzaGlwVHlwZV0uY29vcmRpbmF0ZXMgPSBzaGlwQ29vcmRpbmF0ZXM7XG4gICAgICByZXR1cm4gXCJwbGFjZWRcIjtcbiAgICB9IGVsc2UgcmV0dXJuIGVycm9yO1xuICB9XG5cbiAgcmFuZG9taXplU2hpcHMoKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxTaGlwcygpO1xuICAgIGNvbnN0IHNoaXBUeXBlcyA9IHRoaXMubGlzdFNoaXBUeXBlcygpO1xuXG4gICAgc2hpcFR5cGVzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGxldCBwbGFjZWQgPSBmYWxzZTtcbiAgICAgIGxldCBhdHRlbXB0cyA9IDA7XG4gICAgICBjb25zdCBtYXhBdHRlbXB0cyA9IDUwMDtcblxuICAgICAgbGV0IGNvb3JkaW5hdGVzID0ge1xuICAgICAgICBob3Jpem9udGFsOiB0aGlzLmdhbWVib2FyZENvb3JkaW5hdGVzKCksXG4gICAgICAgIHZlcnRpY2FsOiB0aGlzLmdhbWVib2FyZENvb3JkaW5hdGVzKCksXG4gICAgICB9O1xuXG4gICAgICB3aGlsZSAoIXBsYWNlZCAmJiBhdHRlbXB0cyA8PSBtYXhBdHRlbXB0cykge1xuICAgICAgICBjb25zdCBvcmllbnRhdGlvbiA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyBcImhvcml6b250YWxcIiA6IFwidmVydGljYWxcIjtcbiAgICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKFxuICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiBjb29yZGluYXRlc1tvcmllbnRhdGlvbl0ubGVuZ3RoLFxuICAgICAgICApO1xuICAgICAgICBjb25zdCByYW5kb21Db29yZGluYXRlID0gY29vcmRpbmF0ZXNbb3JpZW50YXRpb25dW3JhbmRvbUluZGV4XTtcblxuICAgICAgICBjb25zdCBzaGlwUGxhY2VtZW50V29ya2VkID0gdGhpcy5wbGFjZVNoaXAoXG4gICAgICAgICAgcmFuZG9tQ29vcmRpbmF0ZVswXSxcbiAgICAgICAgICByYW5kb21Db29yZGluYXRlWzFdLFxuICAgICAgICAgIG9yaWVudGF0aW9uLFxuICAgICAgICAgIHNoaXAsXG4gICAgICAgICk7XG4gICAgICAgIGlmIChzaGlwUGxhY2VtZW50V29ya2VkICE9PSBcInBsYWNlZFwiKSB7XG4gICAgICAgICAgY29vcmRpbmF0ZXNbb3JpZW50YXRpb25dLnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4gICAgICAgICAgLy8gdHJ5IGFnYWluXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGxhY2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF0dGVtcHRzKys7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZW1vdmVTaGlwKHNoaXApIHtcbiAgICB0aGlzW3NoaXBdLmNvb3JkaW5hdGVzID0gW107XG4gIH1cblxuICByZW1vdmVBbGxTaGlwcygpIHtcbiAgICBjb25zdCBzaGlwVHlwZXMgPSB0aGlzLmxpc3RTaGlwVHlwZXMoKTtcblxuICAgIHNoaXBUeXBlcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICB0aGlzLnJlbW92ZVNoaXAoc2hpcCk7XG4gICAgfSk7XG4gIH1cblxuICByZWNlaXZlQXR0YWNrKGxldHRlckNvb3JkaW5hdGUsIG51bWJlckNvb3JkaW5hdGUpIHtcbiAgICBjb25zdCBzaGlwVHlwZXMgPSB0aGlzLmxpc3RTaGlwVHlwZXMoKTtcbiAgICBsZXQgaGl0ID0gZmFsc2U7XG5cbiAgICBzaGlwVHlwZXMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgdGhpc1tzaGlwXS5jb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjb29yZGluYXRlWzBdID09PSBsZXR0ZXJDb29yZGluYXRlICYmXG4gICAgICAgICAgY29vcmRpbmF0ZVsxXSA9PT0gbnVtYmVyQ29vcmRpbmF0ZVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLmhpdHMucHVzaChbbGV0dGVyQ29vcmRpbmF0ZSwgbnVtYmVyQ29vcmRpbmF0ZV0pO1xuICAgICAgICAgIHRoaXNbc2hpcF0uc2hpcC5oaXQoKTtcbiAgICAgICAgICBoaXQgPSB0cnVlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpZiAoaGl0ID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5taXNzZXMucHVzaChbbGV0dGVyQ29vcmRpbmF0ZSwgbnVtYmVyQ29vcmRpbmF0ZV0pO1xuICAgIH1cbiAgfVxuXG4gIGxpc3RTaGlwTG9jYXRpb25zKCkge1xuICAgIGxldCBzaGlwTG9jYXRpb25zID0gW107XG5cbiAgICB0aGlzLmxpc3RTaGlwVHlwZXMoKS5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBzaGlwTG9jYXRpb25zID0gc2hpcExvY2F0aW9ucy5jb25jYXQodGhpc1tzaGlwXS5jb29yZGluYXRlcyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2hpcExvY2F0aW9ucztcbiAgfVxuXG4gIGxpc3RHcmlkQ2VsbHNXaXRoQXNzb2NpYXRlZFNoaXAoKSB7XG4gICAgbGV0IHNoaXBMb2NhdGlvbnMgPSBbXTtcblxuICAgIHRoaXMubGlzdFNoaXBUeXBlcygpLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGlmICh0aGlzW3NoaXBdLmNvb3JkaW5hdGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsZW5ndGggPSB0aGlzW3NoaXBdLnNoaXAubGVuZ3RoO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzW3NoaXBdLmNvb3JkaW5hdGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNoaXBMb2NhdGlvbnMucHVzaChbXG4gICAgICAgICAgICBbdGhpc1tzaGlwXS5jb29yZGluYXRlc1tpXVswXSArIHRoaXNbc2hpcF0uY29vcmRpbmF0ZXNbaV1bMV1dLFxuICAgICAgICAgICAgc2hpcCxcbiAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBzaGlwTG9jYXRpb25zO1xuICB9XG5cbiAgbGlzdFNoaXBUeXBlcygpIHtcbiAgICByZXR1cm4gW1wiY2FycmllclwiLCBcImJhdHRsZXNoaXBcIiwgXCJjcnVpc2VyXCIsIFwic3VibWFyaW5lXCIsIFwiZGVzdHJveWVyXCJdO1xuICB9XG5cbiAgcGxhY2VkU2hpcHMoKSB7XG4gICAgY29uc3QgYWxsU2hpcFR5cGVzID0gdGhpcy5saXN0U2hpcFR5cGVzKCk7XG4gICAgbGV0IHBsYWNlZFNoaXBzID0gMDtcblxuICAgIGFsbFNoaXBUeXBlcy5mb3JFYWNoKChzaGlwVHlwZSkgPT4ge1xuICAgICAgaWYgKHRoaXNbc2hpcFR5cGVdLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGxhY2VkU2hpcHMrKztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBwbGFjZWRTaGlwcztcbiAgfVxuXG4gIGFsbFNoaXBzUGxhY2VkKCkge1xuICAgIHJldHVybiAodGhpcy5wbGFjZWRTaGlwcyA9IDUpO1xuICB9XG5cbiAgYWxsU2hpcHNTdW5rKCkge1xuICAgIGxldCBudW1iZXJPZlN1bmtlblNoaXBzID0gMDtcbiAgICBjb25zdCBhbGxTaGlwVHlwZXMgPSB0aGlzLmxpc3RTaGlwVHlwZXMoKTtcblxuICAgIGFsbFNoaXBUeXBlcy5mb3JFYWNoKChzaGlwVHlwZSkgPT4ge1xuICAgICAgaWYgKHRoaXNbc2hpcFR5cGVdLnNoaXAuaXNTdW5rKCkpIHtcbiAgICAgICAgbnVtYmVyT2ZTdW5rZW5TaGlwcysrO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG51bWJlck9mU3Vua2VuU2hpcHMgPT09IHRoaXMucGxhY2VkU2hpcHMoKTtcbiAgfVxuXG4gIGdhbWVib2FyZENvb3JkaW5hdGVzKCkge1xuICAgIGNvbnN0IGxldHRlcnMgPSBcIkFCQ0RFRkdISUpcIi5zcGxpdChcIlwiKTtcbiAgICByZXR1cm4gbGV0dGVycy5mbGF0TWFwKChsZXR0ZXIpID0+XG4gICAgICBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoXywgaW5kZXgpID0+IFtsZXR0ZXIsIGluZGV4ICsgMV0pLFxuICAgICk7XG4gIH1cbn1cblxuY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IocGxheWVyLCB0eXBlKSB7XG4gICAgdGhpcy5wbGF5ZXJOdW1iZXIgPSBwbGF5ZXI7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLmdhbWVib2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICB0aGlzLl9wbGFjZXNUb0F0dGFjayA9IHRoaXMuZ2FtZWJvYXJkLmdhbWVib2FyZENvb3JkaW5hdGVzKCk7XG4gIH1cblxuICBBSUF0dGFjaygpIHtcbiAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuX3BsYWNlc1RvQXR0YWNrLmxlbmd0aCk7XG4gICAgY29uc3QgcmFuZG9tQ29vcmRpbmF0ZSA9IHRoaXMuX3BsYWNlc1RvQXR0YWNrW3JhbmRvbUluZGV4XTtcbiAgICB0aGlzLl9wbGFjZXNUb0F0dGFjay5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuICAgIHJldHVybiByYW5kb21Db29yZGluYXRlO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5nYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgdGhpcy5fcGxhY2VzVG9BdHRhY2sgPSB0aGlzLmdhbWVib2FyZC5nYW1lYm9hcmRDb29yZGluYXRlcygpO1xuICB9XG59XG5cbmV4cG9ydCB7IFNoaXAsIEdhbWVib2FyZCwgUGxheWVyIH07XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgaHRtbCxcbmJvZHksXG5kaXYsXG5zcGFuLFxuYXBwbGV0LFxub2JqZWN0LFxuaWZyYW1lLFxuaDEsXG5oMixcbmgzLFxuaDQsXG5oNSxcbmg2LFxucCxcbmJsb2NrcXVvdGUsXG5wcmUsXG5hLFxuYWJicixcbmFjcm9ueW0sXG5hZGRyZXNzLFxuYmlnLFxuY2l0ZSxcbmNvZGUsXG5kZWwsXG5kZm4sXG5lbSxcbmltZyxcbmlucyxcbmtiZCxcbnEsXG5zLFxuc2FtcCxcbnNtYWxsLFxuc3RyaWtlLFxuc3Ryb25nLFxuc3ViLFxuc3VwLFxudHQsXG52YXIsXG5iLFxudSxcbmksXG5jZW50ZXIsXG5kbCxcbmR0LFxuZGQsXG5vbCxcbnVsLFxubGksXG5maWVsZHNldCxcbmZvcm0sXG5sYWJlbCxcbmxlZ2VuZCxcbnRhYmxlLFxuY2FwdGlvbixcbnRib2R5LFxudGZvb3QsXG50aGVhZCxcbnRyLFxudGgsXG50ZCxcbmFydGljbGUsXG5hc2lkZSxcbmNhbnZhcyxcbmRldGFpbHMsXG5lbWJlZCxcbmZpZ3VyZSxcbmZpZ2NhcHRpb24sXG5mb290ZXIsXG5oZWFkZXIsXG5oZ3JvdXAsXG5tZW51LFxubmF2LFxub3V0cHV0LFxucnVieSxcbnNlY3Rpb24sXG5zdW1tYXJ5LFxudGltZSxcbm1hcmssXG5hdWRpbyxcbnZpZGVvIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBib3JkZXI6IDA7XG4gIGZvbnQtc2l6ZTogMTAwJTtcbiAgZm9udDogaW5oZXJpdDtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuYXJ0aWNsZSxcbmFzaWRlLFxuZGV0YWlscyxcbmZpZ2NhcHRpb24sXG5maWd1cmUsXG5mb290ZXIsXG5oZWFkZXIsXG5oZ3JvdXAsXG5tZW51LFxubmF2LFxuc2VjdGlvbiB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuYm9keSB7XG4gIGxpbmUtaGVpZ2h0OiAxO1xufVxub2wsXG51bCB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG59XG5ibG9ja3F1b3RlLFxucSB7XG4gIHF1b3Rlczogbm9uZTtcbn1cbmJsb2NrcXVvdGU6YmVmb3JlLFxuYmxvY2txdW90ZTphZnRlcixcbnE6YmVmb3JlLFxucTphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGNvbnRlbnQ6IG5vbmU7XG59XG50YWJsZSB7XG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XG4gIGJvcmRlci1zcGFjaW5nOiAwO1xufVxuXG46cm9vdCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBtaW4taGVpZ2h0OiAxMDB2aDtcbn1cblxuYm9keSB7XG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2U7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIG1heC13aWR0aDogMTUwMHB4O1xufVxuXG5oZWFkZXIge1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoIzA1MmY1ZiwgIzAwNTM3Nyk7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgZm9udC1zaXplOiA0cmVtO1xuICBwYWRkaW5nOiAxcmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG59XG5cbmhlYWRlciA+IHNwYW4ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxuQGtleWZyYW1lcyBvc2NpbGxhdGUge1xuICBmcm9tIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSkgc2NhbGUoMCk7XG4gICAgb3BhY2l0eTogMC4zO1xuICB9XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSkgc2NhbGUoMSk7XG4gICAgb3BhY2l0eTogMC44O1xuICB9XG59XG5cbi5leHBsb3Npb24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XG4gIGFuaW1hdGlvbjogb3NjaWxsYXRlIDEuNzVzIGluZmluaXRlIGFsdGVybmF0ZTtcbiAgei1pbmRleDogMTtcbn1cblxuLmZvcm0tY29udGFpbmVyIHtcbiAgcGFkZGluZzogMTVweDtcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KCMwMDUzNzczYiwgI2YxYTMwOGIwKTtcbn1cblxuLmluc3RydWN0aW9ucyB7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAgcGFkZGluZzogNHB4O1xuICBmb250LXdlaWdodDogYm9sZGVyO1xufVxuXG4uZm9ybS1oZWFkZXIge1xuICBmb250LXNpemU6IDJyZW07XG4gIHBhZGRpbmc6IDhweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBjb2xvcjogIzc0MDgwMDtcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG59XG5cbmZvcm0ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGdhcDogMTVweDtcbiAgcGFkZGluZzogMTVweDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xufVxuXG5mb3JtID4gZGl2IHtcbiAgZmxleDogMCAxIDQ0MHB4O1xuICBkaXNwbGF5OiBncmlkO1xuICBwYWRkaW5nOiA0cHg7XG4gIGdhcDogMTBweDtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgMWZyIDIwcHg7XG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG4gIHBhZGRpbmctcmlnaHQ6IDEwcHg7XG4gIGJvcmRlci1yaWdodDogMXB4IGdyZXkgZG90dGVkO1xuICBib3JkZXItYm90dG9tOiAxcHggZ3JleSBkb3R0ZWQ7XG59XG5cbi5jYXJyaWVyLWNvbnRhaW5lciB7XG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNzQ3KTtcbn1cblxuLmJhdHRsZXNoaXAtY29udGFpbmVyIHtcbiAgY29sb3I6IHJnYmEoMCwgODcsIDQsIDAuNzQ3KTtcbn1cblxuLmNydWlzZXItY29udGFpbmVyIHtcbiAgY29sb3I6IHJnYmEoMTk5LCAwLCAwLCAwLjc0Nyk7XG59XG5cbi5zdWJtYXJpbmUtY29udGFpbmVyIHtcbiAgY29sb3I6IHJnYmEoMTcsIDAsIDE3MywgMC43NDcpO1xufVxuXG4uZGVzdHJveWVyLWNvbnRhaW5lciB7XG4gIGNvbG9yOiByZ2JhKDEyNiwgMCwgMTE5LCAwLjc0Nyk7XG59XG5cbmZvcm0gPiBkaXYgPiBkaXYge1xuICBmb250LXNpemU6IDEuOHJlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIHBhZGRpbmctcmlnaHQ6IDEwcHg7XG4gIGdyaWQtYXJlYTogMSAvIDEgLyAyIC8gMjtcbn1cblxuc2VsZWN0IHtcbiAgd2lkdGg6IG1pbi1jb250ZW50O1xuICBqdXN0aWZ5LXNlbGY6IGVuZDtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBwYWRkaW5nOiA0cHg7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgZ3JpZC1hcmVhOiAxIC8gMiAvIDIgLyA0O1xufVxuXG5sYWJlbCB7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAganVzdGlmeS1zZWxmOiBlbmQ7XG4gIGdyaWQtYXJlYTogMiAvIDIgLyAzIC8gMztcbn1cblxuaW5wdXRbdHlwZT1cInRleHRcIl0ge1xuICBwYWRkaW5nOiA0cHg7XG4gIHdpZHRoOiA0MHB4O1xuICBmb250LXNpemU6IDFyZW07XG4gIGp1c3RpZnktc2VsZjogZW5kO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIGdyaWQtYXJlYTogMiAvIDMgLyAzIC8gNDtcbn1cblxuLmVycm9yIHtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBjb2xvcjogcmVkO1xuICBncmlkLWFyZWE6IDMgLyAxIC8gNCAvIDQ7XG59XG5cbi5idXR0b25zIHtcbiAgd2lkdGg6IDQwMHB4O1xuICBoZWlnaHQ6IG1pbi1jb250ZW50O1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICBib3JkZXI6IG5vbmU7XG59XG5cbiNwbGF5LWdhbWUtYnRuLFxuI3Jlc2V0LWdhbWUtYnRuIHtcbiAgcGFkZGluZzogMTBweCAyMHB4O1xuICBmb250LXdlaWdodDogYm9sZGVyO1xuICBmb250LXNpemU6IDJyZW07XG4gIGJvcmRlcjogMXB4IGJsYWNrIHNvbGlkO1xuICBib3JkZXItcmFkaXVzOiAxNXB4O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIG1hcmdpbjogNXB4O1xuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgZWFzZTtcbn1cblxuI3BsYXktZ2FtZS1idG4ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDUyZjVmO1xuICBjb2xvcjogd2hpdGU7XG59XG5cbiNwbGF5LWdhbWUtYnRuOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwNTM3Nztcbn1cblxuI3Jlc2V0LWdhbWUtYnRuIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y0NDMzNjtcbiAgY29sb3I6IHdoaXRlO1xufVxuXG4jcmVzZXQtZ2FtZS1idG46aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGExOTBiO1xufVxuXG4jcGxheS1nYW1lLWJ0bjphY3RpdmUsXG4jcmVzZXQtZ2FtZS1idG46YWN0aXZlIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgwLjk1KTtcbn1cblxuLmdhbWVib2FyZHMge1xuICBtYXJnaW4tdG9wOiAyNXB4O1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiBtaW4tY29udGVudDtcbiAgZGlzcGxheTogZmxleDtcbiAgY29sdW1uLWdhcDogMTB2dztcbiAgcm93LWdhcDogMjVweDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZsZXgtd3JhcDogd3JhcDtcbn1cblxuLmdhbWVib2FyZCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdhcDogMHB4O1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMSwgMzJweCk7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDExLCAzMnB4KTtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG1hcmdpbi1ib3R0b206IDI0cHg7XG59XG5cbi5jb2x1bW4tbnVtYmVyLFxuLnJvdy1sZXR0ZXIge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogMjBweDtcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xufVxuXG4uZ2FtZXRpbGUge1xuICB3aWR0aDogMzJweDtcbiAgaGVpZ2h0OiAzMnB4O1xuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDZhNzdkO1xufVxuXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDc2OHB4KSB7XG4gIC5nYW1lYm9hcmQge1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDExLCA1NnB4KTtcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMSwgNTZweCk7XG4gIH1cblxuICAuY29sdW1uLW51bWJlcixcbiAgLnJvdy1sZXR0ZXIge1xuICAgIGZvbnQtc2l6ZTogMzBweDtcbiAgfVxuXG4gIC5nYW1ldGlsZSB7XG4gICAgd2lkdGg6IDU2cHg7XG4gICAgaGVpZ2h0OiA1NnB4O1xuICB9XG59XG5cbi5jYXJyaWVyLFxuLmJhdHRsZXNoaXAsXG4uY3J1aXNlcixcbi5zdWJtYXJpbmUsXG4uZGVzdHJveWVyIHtcbiAgYm9yZGVyOiAxcHggc29saWQgZ3JleTtcbn1cblxuLmNhcnJpZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNzQ3KTtcbn1cblxuLmJhdHRsZXNoaXAge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDg3LCA0LCAwLjc0Nyk7XG59XG5cbi5jcnVpc2VyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxOTksIDAsIDAsIDAuNzQ3KTtcbn1cblxuLnN1Ym1hcmluZSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTcsIDAsIDE3MywgMC43NDcpO1xufVxuXG4uZGVzdHJveWVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxMjYsIDAsIDExOSwgMC43NDcpO1xufVxuXG4uaGl0OjphZnRlciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgY29udGVudDogXCLwn46vXCI7XG4gIHRvcDogNTAlO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuICBmb250LXNpemU6IDI0cHg7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuXG4ubWlzczo6YWZ0ZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGNvbnRlbnQ6IFwi4q2VXCI7XG4gIHRvcDogNTAlO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuICBmb250LXNpemU6IDI0cHg7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuXG4ubWlzcyxcbi5oaXQge1xuICBjdXJzb3I6IGF1dG87XG59XG5cbmZvb3RlciB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgbWFyZ2luLXRvcDogYXV0bztcbiAgcGFkZGluZzogMnJlbTtcbiAgZm9udC1zaXplOiAzcmVtO1xuICBjb2xvcjogd2hpdGU7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigwLCAwLCAwKTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFB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dGVudFwiOltcImh0bWwsXFxuYm9keSxcXG5kaXYsXFxuc3BhbixcXG5hcHBsZXQsXFxub2JqZWN0LFxcbmlmcmFtZSxcXG5oMSxcXG5oMixcXG5oMyxcXG5oNCxcXG5oNSxcXG5oNixcXG5wLFxcbmJsb2NrcXVvdGUsXFxucHJlLFxcbmEsXFxuYWJicixcXG5hY3JvbnltLFxcbmFkZHJlc3MsXFxuYmlnLFxcbmNpdGUsXFxuY29kZSxcXG5kZWwsXFxuZGZuLFxcbmVtLFxcbmltZyxcXG5pbnMsXFxua2JkLFxcbnEsXFxucyxcXG5zYW1wLFxcbnNtYWxsLFxcbnN0cmlrZSxcXG5zdHJvbmcsXFxuc3ViLFxcbnN1cCxcXG50dCxcXG52YXIsXFxuYixcXG51LFxcbmksXFxuY2VudGVyLFxcbmRsLFxcbmR0LFxcbmRkLFxcbm9sLFxcbnVsLFxcbmxpLFxcbmZpZWxkc2V0LFxcbmZvcm0sXFxubGFiZWwsXFxubGVnZW5kLFxcbnRhYmxlLFxcbmNhcHRpb24sXFxudGJvZHksXFxudGZvb3QsXFxudGhlYWQsXFxudHIsXFxudGgsXFxudGQsXFxuYXJ0aWNsZSxcXG5hc2lkZSxcXG5jYW52YXMsXFxuZGV0YWlscyxcXG5lbWJlZCxcXG5maWd1cmUsXFxuZmlnY2FwdGlvbixcXG5mb290ZXIsXFxuaGVhZGVyLFxcbmhncm91cCxcXG5tZW51LFxcbm5hdixcXG5vdXRwdXQsXFxucnVieSxcXG5zZWN0aW9uLFxcbnN1bW1hcnksXFxudGltZSxcXG5tYXJrLFxcbmF1ZGlvLFxcbnZpZGVvIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3JkZXI6IDA7XFxuICBmb250LXNpemU6IDEwMCU7XFxuICBmb250OiBpbmhlcml0O1xcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5hcnRpY2xlLFxcbmFzaWRlLFxcbmRldGFpbHMsXFxuZmlnY2FwdGlvbixcXG5maWd1cmUsXFxuZm9vdGVyLFxcbmhlYWRlcixcXG5oZ3JvdXAsXFxubWVudSxcXG5uYXYsXFxuc2VjdGlvbiB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuYm9keSB7XFxuICBsaW5lLWhlaWdodDogMTtcXG59XFxub2wsXFxudWwge1xcbiAgbGlzdC1zdHlsZTogbm9uZTtcXG59XFxuYmxvY2txdW90ZSxcXG5xIHtcXG4gIHF1b3Rlczogbm9uZTtcXG59XFxuYmxvY2txdW90ZTpiZWZvcmUsXFxuYmxvY2txdW90ZTphZnRlcixcXG5xOmJlZm9yZSxcXG5xOmFmdGVyIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbiAgY29udGVudDogbm9uZTtcXG59XFxudGFibGUge1xcbiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXG4gIGJvcmRlci1zcGFjaW5nOiAwO1xcbn1cXG5cXG46cm9vdCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBtaW4taGVpZ2h0OiAxMDB2aDtcXG59XFxuXFxuYm9keSB7XFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBtYXgtd2lkdGg6IDE1MDBweDtcXG59XFxuXFxuaGVhZGVyIHtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgjMDUyZjVmLCAjMDA1Mzc3KTtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGZvbnQtc2l6ZTogNHJlbTtcXG4gIHBhZGRpbmc6IDFyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LXdlaWdodDogYm9sZGVyO1xcbn1cXG5cXG5oZWFkZXIgPiBzcGFuIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG59XFxuXFxuQGtleWZyYW1lcyBvc2NpbGxhdGUge1xcbiAgZnJvbSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKSBzY2FsZSgwKTtcXG4gICAgb3BhY2l0eTogMC4zO1xcbiAgfVxcbiAgdG8ge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSkgc2NhbGUoMSk7XFxuICAgIG9wYWNpdHk6IDAuODtcXG4gIH1cXG59XFxuXFxuLmV4cGxvc2lvbiB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiA1MCU7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XFxuICBhbmltYXRpb246IG9zY2lsbGF0ZSAxLjc1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxuICB6LWluZGV4OiAxO1xcbn1cXG5cXG4uZm9ybS1jb250YWluZXIge1xcbiAgcGFkZGluZzogMTVweDtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgjMDA1Mzc3M2IsICNmMWEzMDhiMCk7XFxufVxcblxcbi5pbnN0cnVjdGlvbnMge1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbiAgcGFkZGluZzogNHB4O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG59XFxuXFxuLmZvcm0taGVhZGVyIHtcXG4gIGZvbnQtc2l6ZTogMnJlbTtcXG4gIHBhZGRpbmc6IDhweDtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBjb2xvcjogIzc0MDgwMDtcXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xcbn1cXG5cXG5mb3JtIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxuICBnYXA6IDE1cHg7XFxuICBwYWRkaW5nOiAxNXB4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxufVxcblxcbmZvcm0gPiBkaXYge1xcbiAgZmxleDogMCAxIDQ0MHB4O1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIHBhZGRpbmc6IDRweDtcXG4gIGdhcDogMTBweDtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDFmciAyMHB4O1xcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcXG4gIHBhZGRpbmctcmlnaHQ6IDEwcHg7XFxuICBib3JkZXItcmlnaHQ6IDFweCBncmV5IGRvdHRlZDtcXG4gIGJvcmRlci1ib3R0b206IDFweCBncmV5IGRvdHRlZDtcXG59XFxuXFxuLmNhcnJpZXItY29udGFpbmVyIHtcXG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNzQ3KTtcXG59XFxuXFxuLmJhdHRsZXNoaXAtY29udGFpbmVyIHtcXG4gIGNvbG9yOiByZ2JhKDAsIDg3LCA0LCAwLjc0Nyk7XFxufVxcblxcbi5jcnVpc2VyLWNvbnRhaW5lciB7XFxuICBjb2xvcjogcmdiYSgxOTksIDAsIDAsIDAuNzQ3KTtcXG59XFxuXFxuLnN1Ym1hcmluZS1jb250YWluZXIge1xcbiAgY29sb3I6IHJnYmEoMTcsIDAsIDE3MywgMC43NDcpO1xcbn1cXG5cXG4uZGVzdHJveWVyLWNvbnRhaW5lciB7XFxuICBjb2xvcjogcmdiYSgxMjYsIDAsIDExOSwgMC43NDcpO1xcbn1cXG5cXG5mb3JtID4gZGl2ID4gZGl2IHtcXG4gIGZvbnQtc2l6ZTogMS44cmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbiAgcGFkZGluZy1yaWdodDogMTBweDtcXG4gIGdyaWQtYXJlYTogMSAvIDEgLyAyIC8gMjtcXG59XFxuXFxuc2VsZWN0IHtcXG4gIHdpZHRoOiBtaW4tY29udGVudDtcXG4gIGp1c3RpZnktc2VsZjogZW5kO1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbiAgcGFkZGluZzogNHB4O1xcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xcbiAgZ3JpZC1hcmVhOiAxIC8gMiAvIDIgLyA0O1xcbn1cXG5cXG5sYWJlbCB7XFxuICBmb250LXNpemU6IDFyZW07XFxuICBqdXN0aWZ5LXNlbGY6IGVuZDtcXG4gIGdyaWQtYXJlYTogMiAvIDIgLyAzIC8gMztcXG59XFxuXFxuaW5wdXRbdHlwZT1cXFwidGV4dFxcXCJdIHtcXG4gIHBhZGRpbmc6IDRweDtcXG4gIHdpZHRoOiA0MHB4O1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbiAganVzdGlmeS1zZWxmOiBlbmQ7XFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxuICBncmlkLWFyZWE6IDIgLyAzIC8gMyAvIDQ7XFxufVxcblxcbi5lcnJvciB7XFxuICBmb250LXNpemU6IDE2cHg7XFxuICBjb2xvcjogcmVkO1xcbiAgZ3JpZC1hcmVhOiAzIC8gMSAvIDQgLyA0O1xcbn1cXG5cXG4uYnV0dG9ucyB7XFxuICB3aWR0aDogNDAwcHg7XFxuICBoZWlnaHQ6IG1pbi1jb250ZW50O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtd3JhcDogd3JhcDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgYm9yZGVyOiBub25lO1xcbn1cXG5cXG4jcGxheS1nYW1lLWJ0bixcXG4jcmVzZXQtZ2FtZS1idG4ge1xcbiAgcGFkZGluZzogMTBweCAyMHB4O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG4gIGZvbnQtc2l6ZTogMnJlbTtcXG4gIGJvcmRlcjogMXB4IGJsYWNrIHNvbGlkO1xcbiAgYm9yZGVyLXJhZGl1czogMTVweDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIG1hcmdpbjogNXB4O1xcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjNzIGVhc2U7XFxufVxcblxcbiNwbGF5LWdhbWUtYnRuIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwNTJmNWY7XFxuICBjb2xvcjogd2hpdGU7XFxufVxcblxcbiNwbGF5LWdhbWUtYnRuOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDUzNzc7XFxufVxcblxcbiNyZXNldC1nYW1lLWJ0biB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjQ0MzM2O1xcbiAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4jcmVzZXQtZ2FtZS1idG46aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2RhMTkwYjtcXG59XFxuXFxuI3BsYXktZ2FtZS1idG46YWN0aXZlLFxcbiNyZXNldC1nYW1lLWJ0bjphY3RpdmUge1xcbiAgdHJhbnNmb3JtOiBzY2FsZSgwLjk1KTtcXG59XFxuXFxuLmdhbWVib2FyZHMge1xcbiAgbWFyZ2luLXRvcDogMjVweDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiBtaW4tY29udGVudDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBjb2x1bW4tZ2FwOiAxMHZ3O1xcbiAgcm93LWdhcDogMjVweDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbn1cXG5cXG4uZ2FtZWJvYXJkIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBnYXA6IDBweDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDExLCAzMnB4KTtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDExLCAzMnB4KTtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgbWFyZ2luLWJvdHRvbTogMjRweDtcXG59XFxuXFxuLmNvbHVtbi1udW1iZXIsXFxuLnJvdy1sZXR0ZXIge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1zaXplOiAyMHB4O1xcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xcbn1cXG5cXG4uZ2FtZXRpbGUge1xcbiAgd2lkdGg6IDMycHg7XFxuICBoZWlnaHQ6IDMycHg7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDZhNzdkO1xcbn1cXG5cXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDc2OHB4KSB7XFxuICAuZ2FtZWJvYXJkIHtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTEsIDU2cHgpO1xcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMSwgNTZweCk7XFxuICB9XFxuXFxuICAuY29sdW1uLW51bWJlcixcXG4gIC5yb3ctbGV0dGVyIHtcXG4gICAgZm9udC1zaXplOiAzMHB4O1xcbiAgfVxcblxcbiAgLmdhbWV0aWxlIHtcXG4gICAgd2lkdGg6IDU2cHg7XFxuICAgIGhlaWdodDogNTZweDtcXG4gIH1cXG59XFxuXFxuLmNhcnJpZXIsXFxuLmJhdHRsZXNoaXAsXFxuLmNydWlzZXIsXFxuLnN1Ym1hcmluZSxcXG4uZGVzdHJveWVyIHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGdyZXk7XFxufVxcblxcbi5jYXJyaWVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43NDcpO1xcbn1cXG5cXG4uYmF0dGxlc2hpcCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDg3LCA0LCAwLjc0Nyk7XFxufVxcblxcbi5jcnVpc2VyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTk5LCAwLCAwLCAwLjc0Nyk7XFxufVxcblxcbi5zdWJtYXJpbmUge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxNywgMCwgMTczLCAwLjc0Nyk7XFxufVxcblxcbi5kZXN0cm95ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxMjYsIDAsIDExOSwgMC43NDcpO1xcbn1cXG5cXG4uaGl0OjphZnRlciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBjb250ZW50OiBcXFwi8J+Or1xcXCI7XFxuICB0b3A6IDUwJTtcXG4gIGxlZnQ6IDUwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgZm9udC1zaXplOiAyNHB4O1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblxcbi5taXNzOjphZnRlciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBjb250ZW50OiBcXFwi4q2VXFxcIjtcXG4gIHRvcDogNTAlO1xcbiAgbGVmdDogNTAlO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICBmb250LXNpemU6IDI0cHg7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuXFxuLm1pc3MsXFxuLmhpdCB7XFxuICBjdXJzb3I6IGF1dG87XFxufVxcblxcbmZvb3RlciB7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBtYXJnaW4tdG9wOiBhdXRvO1xcbiAgcGFkZGluZzogMnJlbTtcXG4gIGZvbnQtc2l6ZTogM3JlbTtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigwLCAwLCAwKTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5vcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgXCIuL3N0eWxlLmNzc1wiO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vY2xhc3Nlcy5qc1wiO1xuaW1wb3J0IHsgRE9NIH0gZnJvbSBcIi4vRE9NLmpzXCI7XG5cbmNvbnN0IHBsYXllck9uZSA9IG5ldyBQbGF5ZXIoXCJwbGF5ZXJPbmVcIiwgXCJodW1hblwiKTtcbmNvbnN0IHBsYXllclR3byA9IG5ldyBQbGF5ZXIoXCJwbGF5ZXJUd29cIiwgXCJBSVwiKTtcblxuRE9NLnByZUdhbWUocGxheWVyT25lLCBwbGF5ZXJUd28pO1xuXG4vLyBQQyB2cyBjb21wdXRlclxuLy8gc3RhdGU6IFBDIGJvYXJkIGlzIGFsd2F5cyB2aXNpYmxlXG4vLyBzdGF0ZTogY29tcHV0ZXIgYm9hcmQgaXMgbmV2ZXIgdmlzaWJsZVxuLy8gYWx0ZXJuYXRpbmcgc3RhdGU6IHBsYXllciBwaWNrcyBhIHNwb3QgdG8gYXR0YWNrLCBhdHRhY2tzLCBjaGVjayBmb3Igd2luLCB0aGVuIGNvbXB1dGVyIHR1cm5cbi8vIGNvbXB1dGVyIGF0dGFja3MsIGNoZWNrIGZvciB3aW4sIHRoZW4gcGMgYXR0YWNrc1xuIl0sIm5hbWVzIjpbIkRPTSIsInBsYXllckF0dGFja0ZuIiwiYXR0YWNraW5nUGxheWVyIiwiZGVmZW5kaW5nUGxheWVyIiwiZXZlbnQiLCJkZWZlbmRpbmdCb2FyZCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInBsYXllck51bWJlciIsImdhbWV0aWxlIiwidGFyZ2V0IiwiY29vcmRpbmF0ZUFycmF5Iiwic3BsaXRDb29yZGluYXRlcyIsImRhdGFzZXQiLCJjb29yZGluYXRlIiwiZ2FtZWJvYXJkIiwicmVjZWl2ZUF0dGFjayIsInJlbmRlckhpdHMiLCJyZW5kZXJNaXNzZXMiLCJjaGVja0ZvcldpbiIsInNldFRpbWVvdXQiLCJhbGVydCIsImNsaWNrIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImJvdW5kUGxheWVyQXR0YWNrRm4iLCJzdHlsZSIsImN1cnNvciIsInBvaW50ZXJFdmVudHMiLCJjb21wdXRlcnNUdXJuIiwicHJlcEJvYXJkRm9yQXR0YWNrQ2xpY2tFdmVudHMiLCJkZWZlbmRpbmdUaWxlcyIsIkFycmF5IiwiZnJvbSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJiaW5kIiwiZm9yRWFjaCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW5kZXJQbGF5ZXJCb2FyZHMiLCJwbGF5ZXJPbmUiLCJwbGF5ZXJUd28iLCJyZW5kZXJTaGlwcyIsInBsYXllciIsImJvYXJkIiwic2hpcExvY2F0aW9ucyIsImxpc3RHcmlkQ2VsbHNXaXRoQXNzb2NpYXRlZFNoaXAiLCJzaGlwTG9jYXRpb24iLCJncmlkQ2VsbCIsImNsYXNzTGlzdCIsImFkZCIsImhpdHMiLCJjb21iaW5lQ29vcmRpbmF0ZXMiLCJoaXQiLCJtaXNzZXMiLCJtaXNzIiwiaHVtYW5QbGF5ZXIiLCJjb21wdXRlclBsYXllciIsImNvbXB1dGVyc0F0dGFja0Nvb3JkaW5hdGVzIiwiQUlBdHRhY2siLCJhbGxTaGlwc1N1bmsiLCJwcmVHYW1lIiwicGxheUdhbWVGb3JtIiwicGxheUJ0biIsInJlc2V0QnRuIiwic2hpcFR5cGVzIiwibGlzdFNoaXBUeXBlcyIsInBsYWNlU2hpcHNGbiIsInJlbW92ZUFsbFNoaXBzIiwiY2xlYXJCb2FyZHMiLCJlcnJvciIsInByZXZlbnREZWZhdWx0IiwiY2hlY2tWYWxpZGl0eSIsInJlcG9ydFZhbGlkaXR5Iiwic2hpcCIsImNvb3JkaW5hdGVJbnB1dCIsIm9yaWVudGF0aW9uSW5wdXQiLCJlcnJvclNwYW4iLCJyYXdDb29yZGluYXRlcyIsInZhbHVlIiwidXBkYXRlZENvb3JkaW5hdGVzIiwib3JpZW50YXRpb24iLCJ0ZXh0Q29udGVudCIsInNoaXBQbGFjZW1lbnRXb3JrZWQiLCJwbGFjZVNoaXAiLCJzbGljZSIsInRvVXBwZXJDYXNlIiwiZGlzYWJsZWQiLCJyYW5kb21pemVTaGlwcyIsImNvb3JkSW5wdXQiLCJzZXRDdXN0b21WYWxpZGl0eSIsInJlc2V0R2FtZUZuIiwicmVzZXQiLCJnYW1lVGlsZXMiLCJjbGFzc05hbWUiLCJhcnJheSIsIm5ld0FycmF5IiwiY29vcmRpbmF0ZVBhaXIiLCJwdXNoIiwiYXQiLCJTaGlwIiwiY29uc3RydWN0b3IiLCJsZW5ndGgiLCJzdW5rIiwiaXNTdW5rIiwiR2FtZWJvYXJkIiwiY2FycmllciIsImNvb3JkaW5hdGVzIiwiYmF0dGxlc2hpcCIsImNydWlzZXIiLCJzdWJtYXJpbmUiLCJkZXN0cm95ZXIiLCJsZXR0ZXJDb29yZGluYXRlIiwibnVtYmVyQ29vcmRpbmF0ZSIsInNoaXBUeXBlIiwidXBwZXJjYXNlTGV0dGVyQ29vcmRpbmF0ZSIsImFsbG93ZWRMZXR0ZXJzIiwibGV0dGVySW5kZXgiLCJpbmRleE9mIiwic2hpcExlbmd0aCIsInNoaXBDb29yZGluYXRlcyIsImV4aXN0aW5nQ29vcmRpbmF0ZXMiLCJsaXN0U2hpcExvY2F0aW9ucyIsImkiLCJuZXdDb29yZGluYXRlIiwib2xkQ29vcmRpbmF0ZSIsInBsYWNlZCIsImF0dGVtcHRzIiwibWF4QXR0ZW1wdHMiLCJob3Jpem9udGFsIiwiZ2FtZWJvYXJkQ29vcmRpbmF0ZXMiLCJ2ZXJ0aWNhbCIsIk1hdGgiLCJyYW5kb20iLCJyYW5kb21JbmRleCIsImZsb29yIiwicmFuZG9tQ29vcmRpbmF0ZSIsInNwbGljZSIsInJlbW92ZVNoaXAiLCJjb25jYXQiLCJwbGFjZWRTaGlwcyIsImFsbFNoaXBUeXBlcyIsImFsbFNoaXBzUGxhY2VkIiwibnVtYmVyT2ZTdW5rZW5TaGlwcyIsImxldHRlcnMiLCJzcGxpdCIsImZsYXRNYXAiLCJsZXR0ZXIiLCJfIiwiaW5kZXgiLCJQbGF5ZXIiLCJ0eXBlIiwiX3BsYWNlc1RvQXR0YWNrIl0sInNvdXJjZVJvb3QiOiIifQ==