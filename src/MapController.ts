import { CONSTANTS } from './constants'
import { directions } from './utils'
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
  }

  public get map(): MapGrid {
    return this._map
  }

  public findStart(): Position {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === CONSTANTS.START_CHAR) {
          return { x, y }
        }
      }
    }
    throw new Error('Missing start character')
  }

  public findEndPosition(): Position {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === CONSTANTS.END_CHAR) {
          return { x, y }
        }
      }
    }
    throw new Error('End character not found')
  }

  public validateSingleStart(): void {
    let startAmount = 0
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === CONSTANTS.START_CHAR) {
          startAmount += 1
        }
      }
    }
    if (startAmount > 1) throw new Error('Multiple starts')
  }

  public getCurrentChar(positionY: number, positionX: number): string {
    return this.map[positionY][positionX]
  }

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
}
