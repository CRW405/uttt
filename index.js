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
    // board.forEach((place) => console.log(place));
  }
  // console.log("---");
}

let game = create_board(5);
log_board(game);
