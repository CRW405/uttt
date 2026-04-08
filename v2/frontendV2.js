import { create_board, mark } from "./backendV2.js";

let cell_count = 0;
let sub_cell_count = 0;

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
	let cell = document.querySelector(`[data-path='${path.join("-")}']`);

	let marked = mark(board, path, player);

	if (marked) {
		cell.dataset.mark = player;
		render_mark(board, path, player);
		player = -player;
	} else {
		// pass, for now
	}
}

function create_visual_board(container, board, level, path = [0]) {
	cell_count++;
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
		sub_cell_count++;
		let sub_cell = document.createElement("div");
		sub_cell.classList.add("sub_cell");
		sub_cell.dataset.level = 0;

		sub_cell.dataset.path = path.join("-");

		sub_cell.addEventListener("click", (e) => {
			mark_cell(game, path);
		});

		sub_cell.dataset.mark = "0";
		container.appendChild(sub_cell);
	}
}

create_visual_board(visual_board, game, n);
console.log("Total cells created: " + cell_count);
console.log("Total sub cells created: " + sub_cell_count);
