# Battleship Game

A classic Battleship game built with vanilla JavaScript. This project was developed as part of [The Odin Project](https://www.theodinproject.com/) curriculum to practice core JavaScript fundamentals, DOM manipulation, and test-driven development (TDD) with Jest.

## Table of Contents
1. [Features](#features)
2. [Live Demo](#live-demo)
3. [Technologies Used](#technologies-used)
4. [Usage](#usage)
5. [Future Improvements](#future-improvements)
6. [Contributing](#contributing)
7. [License](#license)

---

## Features
- **Dynamic Game Board:** Generates a grid for ship placement and gameplay.
- **Ship Placement & Hit Detection:** Players can place ships and record hits/misses with visual feedback.
- **AI Opponent:** Implements a basic computer opponent that selects random coordinates for its moves.
- **Win Condition Detection:** Automatically checks and declares a win once all ships are sunk.
- **Test-Driven Development:** Uses Jest for comprehensive testing of game logic and win conditions.

---

## Live Demo
**[View Demo on Github Pages (Here)](https://cblaylock18.github.io/battleship/)**  

<img alt="screenshot of project" src="https://github.com/user-attachments/assets/1c5709d2-3afc-4468-85f7-974d166a4150">

---

## Technologies Used
- **Vanilla JavaScript (ES6+)**
- **DOM Manipulation**
- **Jest** for testing
- **Webpack**
- **Git & GitHub** for version control

---

## Usage
1. **Game Setup:** On page load, the game board is generated and ships can be placed with the form at the top.
2. **Errors:** The game smartly calls out errors with ship placement.
3. **Player Interaction:** Click on the enemy grid to launch an attack at enemy coordinates.
4. **AI Moves:** The AI opponent selects random coordinates for its moves.
5. **Win Detection:** The game checks for win conditions and displays a victory or defeat message.

---

## Future Improvements
- **Enhanced AI:** Develop a smarter algorithm for computer moves.
- **UI/UX Enhancements:** Add animations and improve the visual design.
- **Sound Effects:** Integrate audio cues for hits, misses, and game outcomes.

---

## Contributing
Contributions, issues, and feature requests are welcome!  
Feel free to fork the project and open a pull request.

1. Fork the project.
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add a cool feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request.

---

## License
This project is licensed under the [MIT License](./LICENSE.txt). You are free to use, modify, and distribute this project as you see fit.
