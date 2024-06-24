export const isLetter = (char: string): boolean => {
  return /[A-Z]/.test(char)
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
