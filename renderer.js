import { create_board } from "./logic.js";

let player = 1;
let n = 3;
let game = create_board(n);
const visual_board = document.querySelector("#visual-board");

function mark_cell(board, path) {
  let cursor = board;
  let val = 0;
  for (let i = 0; i < path.length; i++) {
    if (Array.isArray(cursor[path[i]])) {
      cursor = cursor[path[i]];
    } else {
      val = cursor[path[i]];
    }
  }

  console.log(cursor[val]);

  if (cursor[val] === 0) {
    cursor[val] = player;
    console.log(player + " placed mark at " + path.join("-"));
  } else {
    console.log("Cell Occupied");
  }

  player = -player;
  create_visual_board(visual_board, board, n);
}

function create_visual_board(container, board, level, path = [0]) {
  if (Array.isArray(board[0])) {
    let super_cell = document.createElement("div");
    super_cell.classList.add("super_cell");
    super_cell.dataset.level = level;
    level--;

    super_cell.dataset.path = path.join("-");

    container.appendChild(super_cell);
    board.forEach((sub_board, index) =>
      create_visual_board(super_cell, sub_board, level, [...path, index]),
    );
  } else {
    let sub_cell = document.createElement("div");
    sub_cell.classList.add("sub_cell");
    sub_cell.dataset.level = 0;

    sub_cell.dataset.path = path.join("-");

    switch (board[path[path.length - 1]]) {
      case 0:
        sub_cell.addEventListener("click", (e) => {
          mark_cell(board, path);
        });
        break;
      case 1:
        sub_cell.innerText = "X";
        sub_cell.classList.add("x-mark");
        break;

      case -1:
        sub_cell.innerText = "O";
        sub_cell.classList.add("o-mark");
        break;

      default:
        console.log("Unkown mark in sub board: " + board);
        break;
    }

    container.appendChild(sub_cell);
  }
}

create_visual_board(visual_board, game, n);
