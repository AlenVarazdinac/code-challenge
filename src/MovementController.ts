import { CONSTANTS } from './constants'
import { isLetter } from './utils'
import { BrokenPathError } from './errors'

export class MovementController {
  private map: MapGrid
  private currentPosition: Position
  private directions: Record<Direction, Position> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  }

  constructor(map: MapGrid, startPosition: Position) {
    this.map = map
    this.currentPosition = startPosition
  }

  public getCurrentPosition(): Position {
    return { ...this.currentPosition }
  }

  public move(direction: Direction): void {
    const nextChar = this.getNextChar(direction)
    if (nextChar === CONSTANTS.EMPTY_SPACE || nextChar === undefined) {
      throw new BrokenPathError('Broken path')
    }
    const directionChange = this.directions[direction]
    this.currentPosition = {
      x: this.currentPosition.x + directionChange.x,
      y: this.currentPosition.y + directionChange.y
    }
  }

  public canMove(direction: Direction): boolean {
    const nextChar = this.getNextChar(direction)
    console.log(`Checking if can move ${direction}, next char: '${nextChar}'`)
    const isVertical = direction === 'up' || direction === 'down'
    const validChar = isVertical ? CONSTANTS.VERTICAL_PIPE : CONSTANTS.HORIZONTAL_PIPE
    return nextChar === validChar || nextChar === CONSTANTS.INTERSECTION || isLetter(nextChar)
  }

  private getNextChar(direction: Direction): string {
    const { x, y } = this.currentPosition
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
}
