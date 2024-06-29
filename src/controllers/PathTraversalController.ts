import { MovementController } from './MovementController'
import { LetterController } from './LetterController'
import { isLetter, checkForInfiniteLoop } from '../utils/utils'
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

  /**
   * Traverses the map from start to end, collecting letters along the way
   * @returns {TraversalResult} Object containing the collected letters and the path taken
   * @throws {Error} If an invalid path or infinite loop is detected
   */
  public traverse(): { letters: string; path: string } {
    this.initializeTraversal()
    this.mapController.checkForMultipleStartingPaths(this.movementController)

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

  private initializeTraversal(): void {
    this.path = CONSTANTS.START_CHAR
  }

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

  /**
   * Processes the current position on the map.
   * Collects letters if present and changes direction if necessary.
   */
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
