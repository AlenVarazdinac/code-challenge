import { CONSTANTS } from '../utils/constants'
import { directions, isValidCharacter } from '../utils/utils'
import { MovementController } from './MovementController'

export class MapController {
  private static instance: MapController
  private _map!: MapGrid

  public static getInstance(): MapController {
    if (!MapController.instance) {
      MapController.instance = new MapController()
    }
    return MapController.instance
  }

  public set map(map: MapGrid) {
    this._map = map
    this.validateMap()
  }

  public get map(): MapGrid {
    return this._map
  }

  /**
   * Finds the starting position on the map
   * @returns {Position} Coordinates of the start character
   * @throws {Error} If the start character is not found on the map
   */
  public findStart(): Position {
    let startPosition: Position | null = null
    this.forEachCell((char, x, y) => {
      if (char === CONSTANTS.START_CHAR) {
        startPosition = { x, y }
      }
    })

    if (startPosition) return startPosition
    throw new Error('Missing start character')
  }

  public findEndPosition(): Position {
    let endPosition: Position | null = null
    this.forEachCell((char, x, y) => {
      if (char === CONSTANTS.END_CHAR) {
        endPosition = { x, y }
      }
    })

    if (endPosition) return endPosition
    throw new Error('End character not found')
  }

  /**
   * Validates that there is only one start position on the map
   * @throws {Error} If multiple start characters are found
   */
  public validateSingleStart(): void {
    let startAmount = 0
    this.forEachCell((char) => {
      if (char === CONSTANTS.START_CHAR) {
        startAmount += 1
      }
    })
    if (startAmount > 1) throw new Error('Multiple starts')
  }

  public getCurrentChar(positionY: number, positionX: number): string {
    return this.map[positionY][positionX]
  }

  /**
   * Checks if there are multiple valid paths from the starting position
   * @param {MovementController} movementController - controller used to check valid moves
   * @throws {Error} If more than one valid starting path is found
   */
  public checkForMultipleStartingPaths(
    movementController: MovementController
  ): void {
    let validPaths = 0

    for (const dir of directions) {
      if (movementController.canMove(dir)) {
        validPaths++
      }
    }

    if (validPaths > 1) {
      throw new Error('Multiple starting paths')
    }
  }

  private validateMap(): void {
    this.forEachCell((char, x, y) => {
      if (!isValidCharacter(this.map[y][x])) {
        throw new Error(`Invalid character '${this.map[y][x]}' at position (${x}, ${y})`)
      }
    })
  }

  /**
   * Iterates over each cell in the map and applies the callback function
   * @param callback function to apply to each cell
   */
  private forEachCell(callback: (char: MapChar, x: number, y: number) => void): void {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        callback(this.map[y][x], x, y)
      }
    }
  }
}
