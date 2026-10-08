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
		target instanceof Cell &&
		target.mark === 0 &&
		super_board.mark === 0 &&
		(free_move || is_valid_move(path))
	) {
		target.mark = player;
		free_move = false;
		update_winners(board, super_board);
		get_valid_moves(board, path);
		return true;
	} else {
		let reason = "";
		if (target.mark !== 0) {
			reason = "Cell is already marked.";
		} else if (super_board.mark !== 0) {
			reason = "Corresponding board is already won.";
		} else if (!free_move && !is_valid_move(path)) {
			reason = "Move is not valid based on the last move.";
			console.log(path + " not in valid moves: ", valid_moves);
		}
		console.log("Invalid move: ", reason);
		return false;
	}
}

function update_winners(board, current_board) {
	while (current_board) {
		const previous_mark = current_board.mark;
		determine_winner(current_board);

		if (current_board.mark === previous_mark || current_board.mark === 0) {
			break;
		}

		if (current_board === board) {
			break;
		}

		const parent_path = current_board.path.slice(0, -1);
		if (parent_path.length < board.path.length) {
			break;
		}
		current_board = find(board, parent_path);
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
	if (!board || !Array.isArray(board.board) || board.mark !== 0) {
		return board?.mark ?? 0;
	}

	winning_shapes.forEach((shape) => {
		if (
			board.board[shape[0]].mark !== 0 &&
			board.board[shape[0]].mark === board.board[shape[1]].mark &&
			board.board[shape[1]].mark === board.board[shape[2]].mark
		) {
			board.mark = board.board[shape[0]].mark;
		}
	});

	if (board.mark === 0 && board.board.every((cell) => cell.mark !== 0)) {
		board.mark = "draw";
	}

	return board.mark;
}

let free_move = true;
let valid_moves = [];

function reset_game_state() {
	free_move = true;
	valid_moves = [];
}

function get_valid_moves(board, last_mark_path) {
	valid_moves = [];

	let marked_board_path = last_mark_path.slice(0, -1);
	let marked_board = find(board, marked_board_path);
	let corresponding_board_path;

	if (marked_board.mark !== 0) {
		let parent_path = marked_board_path.slice(0, -1);
		if (parent_path.length <= board.path.length) {
			free_move = true;
			valid_moves = get_cells(board).map((cell) => cell.path);
			return valid_moves;
		}

		corresponding_board_path = parent_path
			.slice(0, -1)
			.concat(marked_board_path[marked_board_path.length - 1]);
	} else {
		corresponding_board_path = last_mark_path
			.slice(0, -2)
			.concat(last_mark_path[last_mark_path.length - 1]);
	}

	let corresponding_board = find(board, corresponding_board_path);
	if (corresponding_board.mark !== 0) {
		free_move = true;
		valid_moves = get_cells(board).map((cell) => cell.path);
		return valid_moves;
	}

	if (corresponding_board.mark === 0) {
		free_move = false;
		valid_moves = get_cells(corresponding_board).map((cell) => cell.path);
		return valid_moves;
	}
}

function get_cells(board, cells = []) {
	if (board.board[0] instanceof Board) {
		board.board.forEach((sub_board) => get_cells(sub_board, cells));
	} else {
		cells.push(...board.board);
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
	reset_game_state,
};
