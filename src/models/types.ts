type Direction = 'up' | 'down' | 'left' | 'right'

type Position = {
  x: number
  y: number
}

type MapChar = '@' | '-' | '|' | '+' | 'x' | ' ' | string
type MapGrid = MapChar[][]

type CollectedLetter = {
  letter: string
  position: Position
}

type TraversalResult = {
  letters: string
  path: string
}
