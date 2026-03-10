import { create_board } from "./logic.js";

let player = 1;
let n = 3;
let game = create_board(n);
const visual_board = document.querySelector("#visual-board");

function render_mark(board, path, mark) {
  let cell = document.querySelector(`[data-path='${path.join("-")}']`);
  let className = mark === 1 ? "x-mark" : "o-mark";
  let mark_symbol = mark === 1 ? "X" : "O";
  cell.innerText = mark_symbol;
  cell.classList.add(className);
}

function mark_cell(board, path) {
  console.log(path);

  let cell = document.querySelector(`[data-path='${path.join("-")}']`);

  if (cell.dataset.mark !== "0") {
    console.log("Attempted to mark already marked cell, ignored");
    return;
  }

  let cursor = board;
  let val = 0;
  for (let i = 0; i < path.length; i++) {
    if (Array.isArray(cursor[path[i]])) {
      cursor = cursor[path[i]];
    } else {
      val = cursor[path[i]];
    }
  }

  // console.log(cursor[val]);

  if (cursor[val] === 0) {
    cursor[val] = player;
    let player_mark = player === 1 ? "X" : "O";
    console.log(
      "[renderer][mark_cell()] " +
        player_mark +
        " placed mark at " +
        path.join("-"),
    );
    cell.dataset.mark = player;
    render_mark(board, path, player);
  } else {
    console.log("Cell Occupied");
    player = -player;
  }

  player = -player;
}

function create_visual_board(container, board, level, path = [0]) {
  // console.log("[renderer][create_visual_board()]");
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

    sub_cell.addEventListener("click", (e) => {
      mark_cell(board, path);
    });

    // sub_cell.innerText = board[path[path.length - 1]];
    sub_cell.dataset.mark = "0";
    container.appendChild(sub_cell);
  }
}

create_visual_board(visual_board, game, n);
