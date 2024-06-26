import { MovementController } from './MovementController'
import { LetterController } from './LetterController'
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
  private letterController: LetterController
  private path: string

  constructor(map: MapGrid) {
    this.map = map
    const startPosition = findStart(map)
    validateSingleStart(map)
    findEndPosition(map)
    this._movementController = new MovementController(map, startPosition)
    this.letterController = new LetterController()
    this.path = ''
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

  // PathTraversal
  public traverse(): { letters: string; path: string } {
    this.initializeTraversal()
    this.checkForMultipleStartingPaths()

    let iterations = 0

    while (iterations < CONSTANTS.MAX_ITERATIONS && !this.isAtEnd()) {
      iterations++
      this.processCurrentPosition()
      this.movementController.move()
      this.updatePath()
    }

    checkForInfiniteLoop(iterations)

    return this.getTraversalResult()
  }

  // PathTraversal
  private initializeTraversal(): void {
    const position = this.getCurrentPosition()
    this.path = CONSTANTS.START_CHAR
    console.log(`Starting traverse at: (${position.x}, ${position.y})`)
  }

  // MapController
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
      this.letterController.collectLetter(char, position)
    }

    this.movementController.changeDirection()
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
    const letters = this.letterController.getCollectedLetters()
    return { letters, path: this.path }
  }

  private getCurrentChar(): string {
    const position = this.getCurrentPosition()
    return getCurrentChar(this.map, position.y, position.x)
  }
}
