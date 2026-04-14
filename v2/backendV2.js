// TODO:
// - draw over captured boards
// - make winning sub board move player to the corresponding cell in the super board (if applicable)
// - add winning whole game when top level board is won

class Cell {
	constructor() {
		this.mark = 0;
		this.path = [];
		this.level = 0;
	}
}

class Board extends Cell {
	constructor() {
		super();
		this.board = [];
	}
}

function create_board(n, path = [0]) {
	let board = new Board();
	board.path = path;
	board.level = path.length;
	// console.log("Creating at path: ", board.path);
	if (n === 1) {
		board.board = Array.from({ length: 9 }, (_, index) => {
			let c = new Cell();
			c.path = [...path, index];
			c.level = path.length + 1;
			return c;
		});
	} else {
		board.board = Array.from({ length: 9 }, (_, index) =>
			create_board(n - 1, [...path, index]),
		);
	}
	return board;
}

function mark(board, path, player) {
	let target = find(board, path);
	let super_board = find(board, path.slice(0, -1));

	if (
		target.mark === 0 &&
		super_board.mark === 0 &&
		(free_move || is_valid_move(path))
	) {
		target.mark = player;
		free_move = false;
		determine_winner(super_board, board);
		get_valid_moves(board, path);
		return true;
	} else {
		let reason = "";
		if (target.mark !== 0) {
			reason = "Cell is already marked.";
		} else if (super_board.mark !== 0) {
			reason = "Corresponding board is already won.";
		} else if (!free_move && !is_valid_move(move_path)) {
			reason = "Move is not valid based on the last move.";
			console.log(move_path + " not in valid moves: ", valid_moves);
		}
		console.log("Invalid move: ", reason);
		return false;
	}
}

function is_valid_move(path) {
	return valid_moves.some(
		(valid_path) =>
			valid_path.length === path.length &&
			valid_path.every((value, index) => value === path[index]),
	);
}

function find(board, path) {
	let target = board;
	let normalized_path = path;

	if (
		Array.isArray(board.path) &&
		path.length >= board.path.length &&
		board.path.every((value, index) => value === path[index])
	) {
		normalized_path = path.slice(board.path.length);
	}

	for (let index of normalized_path) {
		target = target.board[index];
	}

	return target;
}

const winning_shapes = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

function determine_winner(board) {
	winning_shapes.forEach((shape) => {
		if (
			board.board[shape[0]].mark !== 0 &&
			board.board[shape[0]].mark === board.board[shape[1]].mark &&
			board.board[shape[1]].mark === board.board[shape[2]].mark
		) {
			let winner = board.board[shape[0]].mark;
			board.mark = winner;
		} else if (board.board.every((cell) => cell.mark !== 0)) {
			board.mark = "draw";
		}
	});
}

let free_move = true;
let valid_moves = [];

function get_valid_moves(board, last_mark_path) {
	valid_moves = [];

	let corresponding_board_path = last_mark_path
		.slice(0, -2)
		.concat(last_mark_path[last_mark_path.length - 1]);
	let corresponding_board = find(board, corresponding_board_path);
	if (corresponding_board.mark !== 0) {
		free_move = true;
		return;
	}

	if (corresponding_board.mark === 0) {
		valid_moves = get_cells(corresponding_board).map((cell) => cell.path);
		// console.log("Valid moves: ", valid_moves);
		return valid_moves;
	} else {
		// console.log("Valid moves: ", valid_moves);
		valid_moves = get_cells(board).map((cell) => cell.path);
		return valid_moves;
	}
}

function get_cells(board, cells = []) {
	if (board.board[0] instanceof Cell) {
		cells.push(...board.board);
	} else {
		board.board.forEach((sub_board) => get_cells(sub_board, cells));
	}

	return cells;
}

export {
	Cell,
	Board,
	create_board,
	mark,
	find,
	determine_winner,
	get_valid_moves,
};
