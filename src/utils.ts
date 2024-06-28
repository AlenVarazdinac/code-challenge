import { CONSTANTS } from './constants'

export const directionCoordinates: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
}

export const directions: Direction[] = ['up', 'down', 'left', 'right']

const letterRegex = /[A-Zx]/
export const isLetter = (char: string): boolean => {
  return letterRegex.test(char)
}

export const getOppositeDirection = (dir: Direction): Direction => {
  const directions: Record<Direction, Direction> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  }
  return directions[dir]
}

export const checkForInfiniteLoop = (iterations: number): void => {
  if (iterations >= CONSTANTS.MAX_ITERATIONS) {
    throw new Error('Possible infinite loop detected')
  }
}
