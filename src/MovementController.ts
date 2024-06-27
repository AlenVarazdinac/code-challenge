import { CONSTANTS } from './constants'
import { isLetter } from './utils'
import { BrokenPathError } from './errors'
import { MapController } from './MapController'

export class MovementController {
  private map: MapGrid
  private mapController: MapController
  private currentPosition: Position
  private direction: Direction
  private directions: Record<Direction, Position> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  }

  constructor(startPosition: Position) {
    this.mapController = MapController.getInstance()
    this.map = this.mapController.map
    this.currentPosition = startPosition
    this.direction = 'right'
  }

  public getCurrentPosition(): Position {
    return { ...this.currentPosition }
  }

  public move(): void {
    const nextChar = this.getNextChar(this.direction)
    if (nextChar === CONSTANTS.EMPTY_SPACE || nextChar === undefined) {
      throw new BrokenPathError('Broken path')
    }
    const directionChange = this.directions[this.direction]
    this.currentPosition = {
      x: this.currentPosition.x + directionChange.x,
      y: this.currentPosition.y + directionChange.y
    }
  }

  public canMove(direction: Direction): boolean {
    const nextChar = this.getNextChar(direction)
    console.log(`Checking if can move ${direction}, next char: '${nextChar}'`)
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
    const { x: directionX, y: directionY } = this.directions[direction]
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

  private changeDirectionAtIntersection(): void {
    console.log('At an intersection, checking for new direction')
    const possibleDirections: Direction[] = ['up', 'down', 'left', 'right']
    let validDirections: Direction[] = []

    if (this.canMove(this.direction)) {
      console.log(
        `Maintaining current direction at intersection: ${this.direction}`
      )
      return
    }

    for (const dir of possibleDirections) {
      if (
        dir !== this.getOppositeDirection(this.direction) &&
        this.canMove(dir)
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

  private isAtIntersection(char: string): boolean {
    return (
      char === CONSTANTS.INTERSECTION ||
      (isLetter(char) && !this.canMove(this.direction))
    )
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

  public changeDirection(): void {
    const position = this.getCurrentPosition()
    const char = this.getCurrentChar()
    console.log(
      `Changing direction at: (${position.x}, ${position.y}), Current char: '${char}'`
    )

    if (this.isAtStart(char)) {
      return
    }

    if (this.canMove(this.direction)) {
      if (this.getCurrentChar() === CONSTANTS.INTERSECTION)
        throw new Error('Fake turn')
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
      console.log(`Changing direction to: ${this.direction}`)
    }
  }

  private getCurrentChar(): string {
    const position = this.getCurrentPosition()
    return this.mapController.getCurrentChar(position.y, position.x)
  }
}
