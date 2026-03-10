// let l "levels" = int >= 1
//
// let sp "simple Board" = [arr of length 9 with int (-1,0,1)]
//
// let b(l=1) "utt board"  = [arr of length 9 with sp ]
// let p(l=1) "utt place"  = (0-8)
// let w      "utt win"    = [arr of length 9 with (-1,0,1)]
//
// let b(l=2) "uutt board"   = [arr of length 9 containing b(l=1)]
// let p(l=2) "uutt places"  = [arr of length 2 with int (0-8)]
// let w(l=2) "uutt wins"    = [arr of length 2 with [arr of length 9 with (-1, 0, 1)]]
//
// let b(l=n) "recursive board"   = [arr of length 9 containing b(l=n--)]
// let p(l=n) "recursive places"  = [arr of length n with int (0-8)]
// let w(l=n) "recursive wins"    = [arr of length n with [arr of length 9 with (-1, 0, 1)]]
//
// winning_shapes {
//    [0, 1, 2],
//    [3, 4, 5],
//    [6, 7, 8],
//    [0, 3, 6],
//    [1, 4, 7],
//    [2, 5, 8],
//    [0, 4, 8],
//    [2, 4, 6]
// }
//
// func determine_winner(board) {
//    for shape in shapes {
//       if board[shape[0]] == board[shape[1]] == board[shape[2]] == -1 || 1 {
//          return board[shape[0]]
//       }
//    }
// }
//
// use determine_winner() to recursively determine wins that can determine placements on the super board
//
// Tic-Tac-Toe (l=1):
// 1. 3x3 board in which players can place an X or O.
// 2. Players must alternate placing respective marks, marks cannot be placed on the same cell
// 3. The first player to get three of their marks in a straight or diagonal line wins
//
// Ultimate Tic-Tac-Toe (l=2):
// 1. 3x3 board, each cell containing their own 3x3 board in which players can place either an X or O in the sub board
// 2. Players alternate placing respective marks in the sub boards
// 3. When a player places a mark on a sub cell in a sub board, the next player must play the respective sub board on the higher super board
// 4. All normal Tic-Tac-Toe rules apply to the sub board, when a board is won, it is analogous to placing the winning mark over the whole cell
// 5. If a player places a mark that would lead to the next player playing in a board that has already been won / claimed,
// this is treated as a wildcard and the player gets to choose where they want to play, all previous rules applying
// 6. The first player who gets three super cells claimed in a straight or diagonal line wins
//
// Recursive Tic-Tac-Toe (l=n):
// 1. 3x3 board containing another 3x3 board, recursing for n-1 times. There are 3x3 normal sub boards at the bottom of the stack, at the depth of n
// 2. Players alternate placing respective marks in the sub boards
// 3. when a player places a mark at n (the sub boards), then the next player will have to play the corresponding board, eg,
// x marks ...3-6-2-5, then the next player will have to play at the corresponding sub board of ...3-6-5
// 4. The above rule also applies to winning a board, eg, x wins ...3-6-5 then o will have to play in ...3-5
// 5. Blocking / Wildcard rules apply to super boards like before
// 6. The first player to get three super cells of level 1 in a straight or diagonal wins the whole game

function create_board(l) {
  // console.log("Running for l = " + l);

  if (l >= 1) {
    return new Array(9).fill(null).map(() => create_board(l - 1));
  } else {
    return new Array(9).fill(0);
  }
}

function log_board(board, depth = 0) {
  // console.log("---");
  if (Array.isArray(board[0])) {
    const indent = "  ".repeat(depth);

    console.log(`${indent}Board (depth ${depth}):`);

    depth++;
    board.forEach((sub_board) => log_board(sub_board, depth));
  } else {
    board.forEach((place) => console.log(place));
  }
  console.log("---");
}

let winning_shapes = [
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
  let winner = 0;

  winning_shapes.forEach((shape) => {
    if (
      board[shape[0]] !== 0 &&
      board[shape[0]] === board[shape[1]] &&
      board[shape[1]] === board[shape[2]]
    ) {
      winner = board[shape[0]];
      return;
    }
  });

  return winner;
}

// let n = 5;
// let game = create_board(n);
// let place = new Array(n);
// let wins = create_board(n - 1);
// log_board(game);
// log_board(wins);
// let example_simple_board = [1, -1, 1, 0, -1, 0, 0, -1, 0];
// console.log(determine_winner(example_simple_board));

export { create_board, log_board, winning_shapes, determine_winner };
