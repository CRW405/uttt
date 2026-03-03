import { create_board } from "./logic.js";

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

    container.appendChild(sub_cell);
  }
}

let n = 3;
let game = create_board(n);
const visual_board = document.querySelector("#visual-board");
create_visual_board(visual_board, game, n);
