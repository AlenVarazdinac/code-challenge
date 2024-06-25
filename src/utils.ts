import { CONSTANTS } from "./constants"

export const isLetter = (char: string): boolean => {
  return /[A-Zx]/.test(char)
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
    console.log('Max iterations reached, possible infinite loop')
    throw new Error('Possible infinite loop detected')
  }
}
