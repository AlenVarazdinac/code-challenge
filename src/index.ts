import { PathTraversal } from "./PathTraversal"

const map = [
  ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
  [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
  [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+'],
]
// Expected
// ACB
// @---A---+|C|+---+|+-B-x
// @---A---+|C|+---+|+-B-x - received

// const map = [
//   ['@', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//   ['|', ' ', '+', '-', 'C', '-', '-', '+'],
//   ['A', ' ', '|', ' ', ' ', ' ', ' ', '|'],
//   ['+', '-', '-', '-', 'B', '-', '-', '+'],
//   [' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', 'x'],
//   [' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
//   [' ', ' ', '+', '-', '-', '-', 'D', '-', '-', '+']
// ]
// Expected
// ABCD
// @|A+---B--+|+--C-+|-||+---D--+|x
// @|A+---B--+|+--C-+|-||+---D--+|x - received

// const map = [
//   ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
//   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
//   ['x', '-', 'B', '-', '+', ' ', ' ', ' ', '|'],
//   [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
//   [' ', ' ', ' ', ' ', '+', '-', '-', '-', 'C']
// ]
// Expected
// ACB
// @---A---+|||C---+|+-B-x
// @---A---+|||C---+|+-B-x - received

// const map = [
//   [' ', ' ', ' ', ' ', '+', '-', 'O', '-', 'N', '-', '+', ' ', ' '],
//   [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' '],
//   [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '+', '-', 'I', '-', '+'],
//   ['@', '-', 'G', '-', 'O', '-', '+', ' ', '|', ' ', '|', ' ', '|'],
//   [' ', ' ', ' ', ' ', '|', ' ', '|', ' ', '+', '-', '+', ' ', 'E'],
//   [' ', ' ', ' ', ' ', '+', '-', '+', ' ', ' ', ' ', ' ', ' ', 'S'],
//   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
//   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x']
// ]
// Expected
// GOONIES
// @-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x
// @-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x - received

// const map: MapGrid = [
//   [' ', '+', '-', 'L', '-', '+', ' ', ' '],
//   [' ', '|', ' ', ' ', '+', 'A', '-', '+'],
//   ['@', 'B', '+', ' ', '+', '+', ' ', 'H'],
//   [' ', '+', '+', ' ', ' ', ' ', ' ', 'x']
// ]
// Expected
// BLAH
// @B+++B|+-L-+A+++A-+Hx
// @B+++B|+-L-+A+++A-+Hx - Received

// const map = [
//   ['@', '-', 'A', '-', '-', '+', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//   [' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//   [' ', ' ', ' ', ' ', ' ', '+', '-', 'B', '-', '-', 'x', '-', 'C', '-', '-', 'D'],
// ]
// Expected
// AB
// @-A--+|+-B--x
// @-A--+|+-B--x - received

const traversal = new PathTraversal(map)
const result = traversal.traverse()
console.log('Letters:', result.letters)
console.log('Path:', result.path)
