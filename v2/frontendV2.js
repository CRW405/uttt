import {
	Board,
	Cell,
	create_board,
	mark,
	find,
	get_valid_moves,
} from "./backendV2.js";

let n = 3;
let player = 1;
let game = create_board(n);

let container = document.getElementById("visual-board");
create_visual_board(container, game);

function create_visual_board(container, board, level = 0, path = [0]) {
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

		visual_cell.addEventListener("mouseover", (e) => {
			highlight_corresponding(e);
		});
		visual_cell.addEventListener("mouseout", (e) => {
			remove_highlight(e);
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
		render_valid_moves(path);
		player *= -1;
	} else {
		// pass
	}
}

function render_mark(cell, player) {
	let class_name = player === 1 ? "x" : "o";
	cell.classList.add(class_name);
}

function highlight_corresponding(event) {
	let cell_path = event.target.id.split("-").map(Number);
	let board_path = get_corresponding_path(cell_path);
	toggle_corresponding_highlight(board_path, true);
	highlight_corresponding_parent(board_path, n - 1);
}

function highlight_corresponding_parent(path, level) {
	if (level > 0 && path.length > 1) {
		let corresponding_parent_path = get_corresponding_path(path);
		toggle_corresponding_highlight(corresponding_parent_path, true);
		highlight_corresponding_parent(corresponding_parent_path, level - 1);
	}
}

function remove_highlight(event) {
	let cell_path = event.target.id.split("-").map(Number);
	let board_path = get_corresponding_path(cell_path);
	toggle_corresponding_highlight(board_path, false);
	remove_corresponding_parent_highlight(board_path, n - 1);
}

function remove_corresponding_parent_highlight(path, level) {
	if (level > 0 && path.length > 1) {
		let corresponding_parent_path = get_corresponding_path(path);
		toggle_corresponding_highlight(corresponding_parent_path, false);
		remove_corresponding_parent_highlight(corresponding_parent_path, level - 1);
	}
}

function get_corresponding_path(path) {
	let root = path[0];
	let relative_path = path.slice(1);

	if (relative_path.length <= 1) {
		return [root];
	}

	return [
		root,
		...relative_path.slice(0, -2),
		relative_path[relative_path.length - 1],
	];
}

function toggle_corresponding_highlight(path, should_highlight) {
	let corresponding_cell = document.getElementById(path.join("-"));
	if (!corresponding_cell) {
		return;
	}
	corresponding_cell.classList.toggle(
		"corresponding-highlight",
		should_highlight,
	);
}

function render_valid_moves(path) {
	let valid_moves = get_valid_moves(game, path) || [];

	document.querySelectorAll(".valid-move").forEach((cell) => {
		cell.classList.remove("valid-move");
	});

	valid_moves.forEach((move_path) => {
		console.log("Highlighting valid move at path:", move_path);
		let cell = document.getElementById(move_path.join("-"));
		if (cell.classList.contains("x") || cell.classList.contains("o")) {
			console.log("Cell is already marked, skipping highlight:", cell.id);
			return;
		}
		cell.classList.add("valid-move");
	});
}
