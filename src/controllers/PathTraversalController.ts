import { MovementController } from './MovementController'
import { LetterController } from './LetterController'
import { isLetter, directions, checkForInfiniteLoop } from '../utils/utils'
import { CONSTANTS } from '../utils/constants'
import { MapController } from './MapController'

export class PathTraversal {
  private _movementController: MovementController
  private letterController: LetterController
  private mapController: MapController
  private path: string

  constructor() {
    this.mapController = MapController.getInstance()
    const startPosition = this.mapController.findStart()
    this.mapController.validateSingleStart()
    this.mapController.findEndPosition()
    this._movementController = new MovementController(startPosition)
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
  }

  // MapController
  private isAtEnd(): boolean {
    const char = this.getCurrentChar()
    if (char === CONSTANTS.END_CHAR) {
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
  }

  private getTraversalResult(): { letters: string; path: string } {
    const letters = this.letterController.getCollectedLetters()
    return { letters, path: this.path }
  }

  private getCurrentChar(): string {
    const position = this.getCurrentPosition()
    return this.mapController.getCurrentChar(position.y, position.x)
  }
}