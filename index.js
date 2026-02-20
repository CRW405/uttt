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
// shapes {
//    3 across: +1    // 0,1,2 3,4,5 6,7,8
//    3 down  : +3    // 0,3,6 1,4,7 2,5,8
//    / angle : +2    // 2,4,6
//    \ angle : +4    // 0,4,8
// }
//
// from 0: 3
// from 1: 1
// from 2: 2
// from 3: 1
// from 4,5: 0
// from 6: 1
// from 7,8: 0
//
// func determine_winner(board) {
//       let shapes = [1,2,3,4]
//
// }
