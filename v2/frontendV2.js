import { Board, Cell, create_board, mark, find } from "./backendV2.js";

let player = 1;
let game = create_board(2);

let container = document.getElementById("visual-board");
create_visual_board(container, game);

function create_visual_board(container, board, level = 0, path = []) {
	if (board instanceof Board) {
		let visual_board = document.createElement("div");
		visual_board.classList.add("board");
		visual_board.id = path.join("-");
		container.appendChild(visual_board);

		board.board.forEach((cell, index) => {
			create_visual_board(visual_board, cell, level + 1, [...path, index]);
		});
	} else {
		let visual_cell = document.createElement("div");
		visual_cell.classList.add("cell");
		visual_cell.id = path.join("-");
		visual_cell.addEventListener("click", (e) => {
			mark_cell(e);
		});
		container.appendChild(visual_cell);
	}
}

function mark_cell(event) {
	let path = event.target.id.split("-").map(Number);
	let success = mark(game, path, player);

	if (success) {
		find(game, path).mark = player;
		render_mark(event.target, player);
		player *= -1;
	} else {
		// pass
	}
}

function render_mark(cell, player) {
	let class_name = player === 1 ? "x" : "o";
	cell.classList.add(class_name);
}
