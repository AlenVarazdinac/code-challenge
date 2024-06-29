import { CONSTANTS } from '../utils/constants'
import {
  isLetter,
  directionCoordinates,
  directions,
  getOppositeDirection
} from '../utils/utils'
import { MapController } from './MapController'

export class MovementController {
  private map: MapGrid
  private mapController: MapController
  private currentPosition: Position
  private direction: Direction

  constructor(startPosition: Position) {
    this.mapController = MapController.getInstance()
    this.map = this.mapController.map
    this.currentPosition = startPosition
    this.direction = 'right'
  }

  public getCurrentPosition(): Position {
    return { ...this.currentPosition }
  }

  /**
   * Moves the current position one step in the current direction
   * @throws {Error} If the next position is invalid or empty
   */
  public move(): void {
    const nextChar = this.getNextChar(this.direction)
    if (nextChar === CONSTANTS.EMPTY_SPACE || nextChar === undefined) {
      throw new Error('Broken path')
    }
    const directionChange = directionCoordinates[this.direction]
    this.currentPosition = {
      x: this.currentPosition.x + directionChange.x,
      y: this.currentPosition.y + directionChange.y
    }
  }

  /**
   * Checks if movement in a given direction is possible
   * @param {Direction} direction - direction to check for next move
   * @returns {boolean} True if movement is possible, false otherwise
   */
  public canMove(direction: Direction): boolean {
    const nextChar = this.getNextChar(direction)
    const isVertical = direction === 'up' || direction === 'down'
    const validChar = isVertical
      ? CONSTANTS.VERTICAL_PIPE
      : CONSTANTS.HORIZONTAL_PIPE
    return (
      nextChar === validChar ||
      nextChar === CONSTANTS.INTERSECTION ||
      isLetter(nextChar)
    )
  }

  private getNextChar(direction: Direction): string {
    const { x, y } = this.currentPosition
    const { x: directionX, y: directionY } = directionCoordinates[direction]
    const newY = y + directionY
    const newX = x + directionX

    if (
      newY < 0 ||
      newY >= this.map.length ||
      newX < 0 ||
      newX >= this.map[newY].length
    ) {
      return ' '
    }

    return this.map[newY][newX]
  }

  private changeDirectionAtIntersection(): void {
    let validDirections: Direction[] = []

    if (this.canMove(this.direction)) return

    for (const dir of directions) {
      if (dir !== getOppositeDirection(this.direction) && this.canMove(dir)) {
        validDirections.push(dir)
      }
    }

    if (validDirections.length > 1) throw new Error('Fork in path')
    if (validDirections.length === 0)
      throw new Error('No valid direction found at intersection')

    this.direction = validDirections[0]
  }

  private isAtIntersection(char: string): boolean {
    return (
      char === CONSTANTS.INTERSECTION ||
      (isLetter(char) && !this.canMove(this.direction))
    )
  }

  private setInitialDirection(): void {
    for (const dir of directions) {
      if (this.canMove(dir)) {
        this.direction = dir
        return
      }
    }
    throw new Error('No valid path from start')
  }

  private isAtStart(char: string): boolean {
    const position = this.getCurrentPosition()
    if (
      char === CONSTANTS.START_CHAR &&
      (position.x !== 0 || position.y !== 0)
    ) {
      return true
    }
    if (char === CONSTANTS.START_CHAR) {
      this.setInitialDirection()
      return true
    }
    return false
  }

  public changeDirection(): void {
    const char = this.getCurrentChar()

    if (this.isAtStart(char)) return

    if (this.canMove(this.direction)) {
      if (this.getCurrentChar() === CONSTANTS.INTERSECTION)
        throw new Error('Fake turn')
      return
    }

    if (this.isAtIntersection(char)) {
      this.changeDirectionAtIntersection()
      return
    }

    this.changeDirectionForPipe(char)
  }

  private changeDirectionForPipe(char: string): void {
    const isVertical = char === CONSTANTS.VERTICAL_PIPE
    const isHorizontal = char === CONSTANTS.HORIZONTAL_PIPE
    const isMovingHorizontally =
      this.direction === 'left' || this.direction === 'right'

    if (
      (isVertical && isMovingHorizontally) ||
      (isHorizontal && !isMovingHorizontally)
    ) {
      this.direction = this.canMove('up') ? 'up' : 'down'
      if (isHorizontal) {
        this.direction = this.canMove('left') ? 'left' : 'right'
      }
    }
  }

  private getCurrentChar(): string {
    const position = this.getCurrentPosition()
    return this.mapController.getCurrentChar(position.y, position.x)
  }
}
