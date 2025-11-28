"use strict";
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });
const Input = ["w","a","s","d"]

// Board tiles
const PLAYER = "*";
const EMPTY = "░";
const HOLE = "O";
const HAT = "^";

// Hardcoded board
let hardcodedBoard  = [
	[PLAYER, EMPTY, HOLE],
	[EMPTY, HOLE, EMPTY],
	[EMPTY, HAT, EMPTY],
];

// Game state
let playerRow = 0;
let playerCol = 0;
let playing = true;



// Print board
function printBoard(board) {
  console.clear();
  for (const row of board) console.log(row.join(""));
}

// Create random board
function generateField(width, height, holeRate) {
  const field = [];

  for (let r = 0; r < height; r++) {
    const row = [];
    for (let c = 0; c < width; c++) {
      row.push(Math.random() < holeRate ? HOLE : EMPTY);
    }
    field.push(row);
  }

  // Random hat position
  let hr, hc;
  do {
    hr = Math.floor(Math.random() * height);
    hc = Math.floor(Math.random() * width);
  } while (hr === 0 && hc === 0);

  field[0][0] = PLAYER;
  field[hr][hc] = HAT;

  return field;
}

// Input
function getInput() {
  const move = prompt("Move (w/a/s/d): ").trim().toLowerCase();
  return ["w", "a", "s", "d"].includes(move) ? move : "";
}

// Movement
function movePlayer(dir) {
  if (dir === "w") playerRow--;
  if (dir === "s") playerRow++;
  if (dir === "a") playerCol--;
  if (dir === "d") playerCol++;
}

// Check rules
function getStatus(board) {
  if (
    playerRow < 0 ||
    playerCol < 0 ||
    playerRow >= board.length ||
    playerCol >= board[0].length
  ) {
    return "out";
  }

  const tile = board[playerRow][playerCol];

  if (tile === HOLE) return "hole";
  if (tile === HAT) return "hat";
  return "safe";
}

// Update board
function updateBoard(board, oldR, oldC) {
  board[oldR][oldC] = PLAYER;
  if (board[playerRow][playerCol] === EMPTY) {
    board[playerRow][playerCol] = PLAYER;
  }
}

// Game end message
function gameEnd(reason) {
  if (reason === "out") console.log("You moved out of bounds!");
  if (reason === "hole") console.log("You fell into a hole!");
  if (reason === "hat") console.log("You found the hat! You win!");
}

// MAIN GAME LOOP 
function playGame() {
  const field = generateField(6, 5, 0.25);

  playerRow = 0;
  playerCol = 0;
  playing = true;

  let endReason = "";

  do {
    printBoard(field);

    const move = getInput();
    if (!move) {
      console.log("Invalid move, use w/a/s/d.");
      continue;
    }

    const oldR = playerRow;
    const oldC = playerCol;

    movePlayer(move);

    const status = getStatus(field);

    if (status !== "safe") {
      endReason = status;
      playing = false;
    } else {
      updateBoard(field, oldR, oldC);
    }

  } while (playing);

  gameEnd(endReason);
}


playGame();
