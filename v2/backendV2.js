class Cell {
	constructor() {
		this.mark = 0;
		this.path = [];
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
	if (n === 1) {
		board.board = Array.from({ length: 9 }, () => new Cell());
	} else {
		board.board = Array.from({ length: 9 }, (_, index) =>
			create_board(n - 1, [...path, index]),
		);
	}
	return board;
}

function mark(board, path, player) {
	let target = find(board, path);

	if (target.mark === 0) {
		target.mark = player;
		return true;
	} else {
		return false;
	}
}

function find(board, path) {
	let target = board;

	for (let index of path) {
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
	for (let shape of winning_shapes) {
		let marks = shape.map((index) => board.board[index].mark);
		if (marks.every((mark) => mark === 1)) {
			return 1;
		} else if (marks.every((mark) => mark === -1)) {
			return -1;
		}
	}

	return 0;
}

export { Cell, Board, create_board, mark, find, determine_winner };
