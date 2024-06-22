import { findStart, getCurrentChar } from './map'
import { isLetter } from './utils'
import { CONSTANTS } from './constants'
import { BrokenPathError } from './errors'

class PathTraversal {
  private map: MapGrid
  private position: Position
  private direction: Direction
  private collectedLetters: CollectedLetter[]
  private path: string

  constructor(map: MapGrid) {
    this.map = map
    this.position = findStart(map)
    this.direction = 'right' // Initial direction
    this.collectedLetters = []
    this.path = '' // Initialize as empty string
  }

  private readonly directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  }

  private move(): void {
    const nextChar = this.getNextChar(this.direction)
    if (nextChar === CONSTANTS.EMPTY_SPACE || nextChar === undefined) {
      throw new BrokenPathError('Broken path: next position is invalid')
    }
    const direction = this.directions[this.direction]
    this.position.x += direction.x
    this.position.y += direction.y
  }

  private changeDirection(): void {
    const char = getCurrentChar(this.map, this.position.y, this.position.x)
    console.log(
      `Changing direction at: (${this.position.x}, ${this.position.y}), Current char: '${char}'`
    )

    if (this.isAtStart(char)) {
      return
    }

    if (this.canMove(this.direction)) {
      console.log(`Continuing in the same direction: ${this.direction}`)
      return
    }

    if (this.isAtIntersection(char)) {
      this.changeDirectionAtIntersection()
      return
    }

    this.changeDirectionForPipe(char)

    console.log(`Final direction: ${this.direction}`)
  }

  private isAtStart(char: string): boolean {
    if (char === CONSTANTS.START_CHAR && (this.position.x !== 0 || this.position.y !== 0)) {
      console.log(
        'Passed through start character, continuing in current direction'
      )
      return true
    }
    if (char === CONSTANTS.START_CHAR) {
      this.setInitialDirection()
      return true
    }
    return false
  }

  private setInitialDirection(): void {
    console.log('At start character, determining initial direction')
    const directions: Direction[] = ['down', 'right', 'left', 'up']
    for (const dir of directions) {
      if (this.canMove(dir)) {
        this.direction = dir
        console.log(`Initial direction set to: ${this.direction}`)
        return
      }
    }
    throw new Error('No valid path from start')
  }

  private isAtIntersection(char: string): boolean {
    return char === CONSTANTS.INTERSECTION || (isLetter(char) && !this.canMove(this.direction))
  }

  private changeDirectionAtIntersection(): void {
    console.log('At an intersection, checking for new direction')
    const possibleDirections: Direction[] = ['up', 'down', 'left', 'right']
    for (const dir of possibleDirections) {
      if (
        dir !== this.getOppositeDirection(this.direction) &&
        this.canMove(dir)
      ) {
        this.direction = dir
        console.log(`New direction at intersection: ${this.direction}`)
        return
      }
    }
  }

  private changeDirectionForPipe(char: string): void {
    if (
      char === CONSTANTS.VERTICAL_PIPE &&
      (this.direction === 'left' || this.direction === 'right')
    ) {
      this.direction = this.canMove('up') ? 'up' : 'down'
      console.log(`Changing to vertical direction: ${this.direction}`)
    } else if (
      char === '-' &&
      (this.direction === 'up' || this.direction === 'down')
    ) {
      this.direction = this.canMove('left') ? 'left' : 'right'
      console.log(`Changing to horizontal direction: ${this.direction}`)
    }
  }

  private getOppositeDirection(dir: Direction): Direction {
    switch (dir) {
      case 'up':
        return 'down'
      case 'down':
        return 'up'
      case 'left':
        return 'right'
      case 'right':
        return 'left'
    }
  }

  private canMove(direction: Direction): boolean {
    const nextChar = this.getNextChar(direction)
    console.log(`Checking if can move ${direction}, next char: '${nextChar}'`)
    const result =
      direction === 'up' || direction === 'down'
        ? nextChar === CONSTANTS.VERTICAL_PIPE || nextChar === CONSTANTS.INTERSECTION || isLetter(nextChar)
        : nextChar === CONSTANTS.HORIZONTAL_PIPE || nextChar === CONSTANTS.INTERSECTION || isLetter(nextChar)
    console.log(`Can move ${direction}: ${result}`)
    return result
  }

  private getNextChar(direction: Direction): string {
    const { x, y } = this.position
    let nextChar: string
    switch (direction) {
      case 'up':
        nextChar = y > 0 ? this.map[y - 1][x] : ' '
        break
      case 'down':
        nextChar = y < this.map.length - 1 ? this.map[y + 1][x] : ' '
        break
      case 'left':
        nextChar = x > 0 ? this.map[y][x - 1] : ' '
        break
      case 'right':
        nextChar = x < this.map[y].length ? this.map[y][x + 1] : ' '
        break
    }
    console.log(`Next char in direction ${direction}: '${nextChar}'`)
    return nextChar
  }

  private collectLetter(char: string): void {
    if (!isLetter(char)) {
      console.log(`Attempted to collect non-letter character: ${char}`)
      return
    }

    const currentPosition = { x: this.position.x, y: this.position.y }

    if (this.isLetterAlreadyCollected(char, currentPosition)) {
      console.log(
        `Letter ${char} already collected at position (${currentPosition.x}, ${currentPosition.y}), skipping`
      )
      return
    }

    this.addNewCollectedLetter(char, currentPosition)
  }

  private isLetterAlreadyCollected(
    letter: string,
    position: Position
  ): boolean {
    return this.collectedLetters.some(
      (cl) =>
        cl.letter === letter &&
        cl.position.x === position.x &&
        cl.position.y === position.y
    )
  }

  private addNewCollectedLetter(letter: string, position: Position): void {
    this.collectedLetters.push({ letter, position })
    console.log(
      `Added letter: ${letter}, at position (${position.x}, ${position.y})`
    )
  }

  public traverse(): { letters: string; path: string } {
    this.initializeTraversal()

    let iterations = 0

    while (iterations < CONSTANTS.MAX_ITERATIONS && !this.isAtEnd()) {
      iterations++
      this.processCurrentPosition()
      this.moveToNextPosition()
      this.updatePath()
    }

    this.checkForInfiniteLoop(iterations)

    return this.getTraversalResult()
  }

  private initializeTraversal(): void {
    this.path = CONSTANTS.START_CHAR
    console.log(
      `Starting traverse at: (${this.position.x}, ${this.position.y})`
    )
  }

  private isAtEnd(): boolean {
    const char = this.getCurrentChar()
    if (char === CONSTANTS.END_CHAR) {
      console.log('Reached end (x), breaking loop')
      if (!this.path.endsWith(CONSTANTS.END_CHAR)) {
        this.path += CONSTANTS.END_CHAR
      }
      return true
    }
    return false
  }

  private processCurrentPosition(): void {
    const char = this.getCurrentChar()
    console.log(
      `Current char: '${char}', Position: (${this.position.x}, ${this.position.y})`
    )

    if (isLetter(char)) {
      this.collectLetter(char)
    }

    this.changeDirection()
  }

  private moveToNextPosition(): void {
    this.move()
  }

  private updatePath(): void {
    const newChar = this.getCurrentChar()
    if (
      newChar === CONSTANTS.HORIZONTAL_PIPE ||
      newChar === CONSTANTS.VERTICAL_PIPE ||
      newChar === CONSTANTS.INTERSECTION ||
      newChar !== this.path[this.path.length - 1]
    ) {
      this.path += newChar
    }
    console.log(`Current path: ${this.path}`)
  }

  private checkForInfiniteLoop(iterations: number): void {
    if (iterations >= CONSTANTS.MAX_ITERATIONS) {
      console.log('Max iterations reached, possible infinite loop')
      throw new Error('Possible infinite loop detected')
    }
  }

  private getCollectedLettersAsString(): string {
    return this.collectedLetters.map((cl) => cl.letter).join('')
  }

  private getTraversalResult(): { letters: string; path: string } {
    const letters = this.getCollectedLettersAsString()
    return { letters, path: this.path }
  }

  private getCurrentChar(): string {
    return getCurrentChar(this.map, this.position.y, this.position.x)
  }
}

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

// const map = [
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
