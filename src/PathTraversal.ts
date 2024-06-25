import { MovementController } from './MovementController'
import { LetterCollector } from './LetterCollector'
import {
  findEndPosition,
  findStart,
  getCurrentChar,
  validateSingleStart
} from './mapFunctions'
import { isLetter } from './utils'
import { CONSTANTS } from './constants'
import { BrokenPathError } from './errors'
import { checkForInfiniteLoop } from './utils'

export class PathTraversal {
  private map: MapGrid
  private _movementController: MovementController
  private letterCollector: LetterCollector
  private _direction: Direction
  private path: string

  constructor(map: MapGrid) {
    this.map = map
    const startPosition = findStart(map)
    validateSingleStart(map)
    findEndPosition(map)
    this._movementController = new MovementController(map, startPosition)
    this.letterCollector = new LetterCollector()
    this._direction = 'right'
    this.path = ''
  }

  public set direction(direction: Direction) {
    this._direction = direction
  }

  public get direction(): Direction {
    return this._direction
  }

  public get movementController(): MovementController {
    return this._movementController
  }

  public set movementController(controller: MovementController) {
    this._movementController = controller
  }

  private getCurrentPosition(): Position {
    return this.movementController.getCurrentPosition()
  }

  private changeDirection(): void {
    const position = this.getCurrentPosition()
    const char = this.getCurrentChar()
    console.log(
      `Changing direction at: (${position.x}, ${position.y}), Current char: '${char}'`
    )

    if (this.isAtStart(char)) {
      return
    }

    if (this.movementController.canMove(this.direction)) {
      if (this.getCurrentChar() === '+') throw new Error('Fake turn')
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
    const position = this.getCurrentPosition()
    if (
      char === CONSTANTS.START_CHAR &&
      (position.x !== 0 || position.y !== 0)
    ) {
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
      if (this.movementController.canMove(dir)) {
        this.direction = dir
        console.log(`Initial direction set to: ${this.direction}`)
        return
      }
    }
    throw new Error('No valid path from start')
  }

  private isAtIntersection(char: string): boolean {
    return (
      char === CONSTANTS.INTERSECTION ||
      (isLetter(char) && !this.movementController.canMove(this.direction))
    )
  }

  private changeDirectionAtIntersection(): void {
    console.log('At an intersection, checking for new direction')
    const possibleDirections: Direction[] = ['up', 'down', 'left', 'right']
    let validDirections: Direction[] = []

    if (this.movementController.canMove(this.direction)) {
      console.log(
        `Maintaining current direction at intersection: ${this.direction}`
      )
      return
    }

    for (const dir of possibleDirections) {
      if (
        dir !== this.getOppositeDirection(this.direction) &&
        this.movementController.canMove(dir)
      ) {
        validDirections.push(dir)
      }
    }

    console.log('Valid directions:', validDirections)

    if (validDirections.length > 1) throw new Error('Fork in path')
    if (validDirections.length === 0)
      throw new Error('No valid direction found at intersection')

    this.direction = validDirections[0]
    console.log(`New direction at intersection: ${this.direction}`)
  }

  private changeDirectionForPipe(char: string): void {
    if (
      char === CONSTANTS.VERTICAL_PIPE &&
      (this.direction === 'left' || this.direction === 'right')
    ) {
      this.direction = this.movementController.canMove('up') ? 'up' : 'down'
      console.log(`Changing to vertical direction: ${this.direction}`)
    } else if (
      char === CONSTANTS.HORIZONTAL_PIPE &&
      (this.direction === 'up' || this.direction === 'down')
    ) {
      this.direction = this.movementController.canMove('left')
        ? 'left'
        : 'right'
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

  private checkForMultipleStartingPaths(): void {
    let validPaths = 0
    const directions: Direction[] = ['up', 'down', 'left', 'right']

    for (const dir of directions) {
      if (this.movementController.canMove(dir)) {
        validPaths++
      }
    }

    if (validPaths > 1) {
      throw new Error('Multiple starting paths')
    }
  }

  public traverse(): { letters: string; path: string } {
    this.initializeTraversal()
    this.checkForMultipleStartingPaths()

    let iterations = 0

    while (iterations < CONSTANTS.MAX_ITERATIONS && !this.isAtEnd()) {
      iterations++
      this.processCurrentPosition()
      this.moveToNextPosition()
      this.updatePath()
    }

    checkForInfiniteLoop(iterations)

    return this.getTraversalResult()
  }

  private initializeTraversal(): void {
    const position = this.getCurrentPosition()
    this.path = CONSTANTS.START_CHAR
    console.log(`Starting traverse at: (${position.x}, ${position.y})`)
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
    const position = this.getCurrentPosition()
    const char = this.getCurrentChar()
    console.log(
      `Current char: '${char}', Position: (${position.x}, ${position.y})`
    )

    if (isLetter(char)) {
      this.letterCollector.collectLetter(char, position)
    }

    this.changeDirection()
  }

  private moveToNextPosition(): void {
    this.movementController.move(this.direction)
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

  private getTraversalResult(): { letters: string; path: string } {
    const letters = this.letterCollector.getCollectedLetters()
    return { letters, path: this.path }
  }

  private getCurrentChar(): string {
    const position = this.getCurrentPosition()
    return getCurrentChar(this.map, position.y, position.x)
  }
}
