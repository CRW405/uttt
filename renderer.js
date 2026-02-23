import { create_board } from "./logic.js";

function create_visual_board(container, board) {
  if (Array.isArray(board[0])) {
    let super_cell = document.createElement("div");
    super_cell.classList.add("super_cell");

    container.appendChild(super_cell);
    board.forEach((sub_board) => create_visual_board(super_cell, sub_board));
  } else {
    let sub_cell = document.createElement("div");
    sub_cell.classList.add("sub_cell");

    container.appendChild(sub_cell);
  }
}

let n = 2;
let game = create_board(n);
const visual_board = document.querySelector("#visual-board");
create_visual_board(visual_board, game);
