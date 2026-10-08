import {
	Board,
	Cell,
	create_board,
	mark,
	find,
	get_valid_moves,
	reset_game_state,
} from "./backend.js";

let n = 3;
let player = 1;
let game = create_board(n);
let game_over = false;

const container = document.getElementById("visual-board");
const status = document.getElementById("game-status");
const setupScreen = document.getElementById("game-setup");
const setupForm = document.getElementById("game-setup-form");
const depthInput = document.getElementById("game-depth");
const depthWarning = document.getElementById("game-depth-warning");
const gameOverScreen = document.getElementById("game-over-screen");
const gameOverMessage = document.getElementById("game-over-message");
const playAgainButton = document.getElementById("play-again");
const newGameButton = document.getElementById("new-game");

setupForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const depth = Number(depthInput.value);

	if (!Number.isInteger(depth) || depth < 1) {
		depthInput.setCustomValidity(
			"Enter a whole number greater than or equal to 1.",
		);
		depthInput.reportValidity();
		return;
	}

	depthInput.setCustomValidity("");
	start_game(depth);
});

depthInput.addEventListener("input", update_depth_warning);

playAgainButton.addEventListener("click", () => {
	start_game(n);
});

newGameButton.addEventListener("click", () => {
	show_setup();
});

function start_game(depth) {
	n = depth;
	player = 1;
	game_over = false;
	reset_game_state();
	game = create_board(n);
	container.replaceChildren();
	container.classList.remove("game-over");
	create_visual_board(container, game);
	setupScreen.hidden = true;
	gameOverScreen.hidden = true;
	container.hidden = false;
	update_game_status();
}

function show_setup() {
	gameOverScreen.hidden = true;
	setupScreen.hidden = false;
	container.hidden = true;
	status.textContent = "";
	update_depth_warning();
	depthInput.focus();
}

function update_depth_warning() {
	depthWarning.hidden = !(Number(depthInput.value) >= 4);
}

function create_visual_board(container, board, level = 0, path = [0]) {
	if (board instanceof Board) {
		let visual_board = document.createElement("div");
		visual_board.classList.add("board");
		visual_board.id = path.join("-");
		visual_board.dataset.path = path.join("-");
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
	if (game_over) {
		return;
	}

	let path = event.target.id.split("-").map(Number);
	let success = mark(game, path, player);

	if (success) {
		render_mark(event.target, player);
		render_captured_boards();
		render_valid_moves(path);
		player *= -1;
		update_game_status();
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
		let cell = document.getElementById(move_path.join("-"));
		if (!cell || !is_playable(move_path)) {
			return;
		}
		cell.classList.add("valid-move");
	});
}

function is_playable(path) {
	if (find(game, path).mark !== 0) {
		return false;
	}

	for (let length = 1; length < path.length; length++) {
		if (find(game, path.slice(0, length)).mark !== 0) {
			return false;
		}
	}

	return true;
}

function render_captured_boards() {
	document.querySelectorAll(".board").forEach((visual_board) => {
		const board = find(game, visual_board.id.split("-").map(Number));
		let overlay = visual_board.querySelector(":scope > .board-result");

		if (board.mark === 0) {
			overlay?.remove();
			return;
		}

		if (!overlay) {
			overlay = document.createElement("div");
			overlay.classList.add("board-result");
			visual_board.appendChild(overlay);
		}

		overlay.className = `board-result ${board.mark === "draw" ? "draw" : board.mark === 1 ? "x" : "o"}`;
		overlay.textContent =
			board.mark === "draw" ? "DRAW" : board.mark === 1 ? "X" : "O";
		overlay.setAttribute("aria-label", `Board won by ${overlay.textContent}`);
	});
}

function update_game_status() {
	const root_mark = game.mark;
	if (root_mark === 0) {
		status.textContent = `Player ${player === 1 ? "X" : "O"}'s turn`;
		return;
	}

	game_over = true;
	const message =
		root_mark === "draw"
			? "Game ended in a draw"
			: `Player ${root_mark === 1 ? "X" : "O"} wins`;
	status.textContent = message;
	container.classList.add("game-over");
	gameOverMessage.textContent = message;
	gameOverScreen.hidden = false;
}

show_setup();
