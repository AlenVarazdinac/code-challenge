import { CONSTANTS } from "./constants"

export const findStart = (map: MapGrid): Position => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === CONSTANTS.START_CHAR) {
        console.log(`Start found at: (${x}, ${y})`)
        return { x, y }
      }
    }
  }
  throw new Error('Missing start character')
}

export const findEndPosition = (map: MapGrid): Position => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === CONSTANTS.END_CHAR) {
        return { x, y }
      }
    }
  }
  throw new Error('End character not found')
}

export const validateSingleStart = (map: MapGrid): void => {
  let startAmount = 0
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === CONSTANTS.START_CHAR) {
        startAmount += 1
      }
    }
  }
  if (startAmount > 1) throw new Error('Multiple starts')
}

export const getCurrentChar = (map: MapGrid, positionY: number, positionX: number): string => {
  return map[positionY][positionX]
}
