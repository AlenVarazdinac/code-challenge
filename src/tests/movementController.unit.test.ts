import { MovementController } from '../MovementController'
import { BrokenPathError } from '../errors'

describe('MovementController', () => {
  let movementController: MovementController

  beforeEach(() => {
    const map = [
      ['@', '-', 'A', '-', '+'],
      [' ', ' ', ' ', ' ', '|'],
      ['x', '-', 'B', '-', '@']
    ]
    movementController = new MovementController(map, { x: 0, y: 0 })
  })

  test('getCurrentPosition should return the current position', () => {
    expect(movementController.getCurrentPosition()).toEqual({ x: 0, y: 0 })
  })

  test('move should update the current position', () => {
    movementController.move()
    expect(movementController.getCurrentPosition()).toEqual({ x: 1, y: 0 })
  })

  test('move should throw BrokenPathError when moving to empty space', () => {
    movementController['currentPosition'] = { x: 0, y: 1 }
    movementController['direction'] = 'right'

    expect(() => movementController.move()).toThrow(BrokenPathError)
  })

  test('canMove should return true for valid moves', () => {
    expect(movementController.canMove('right')).toBe(true)
  })

  test('canMove should return false for invalid moves', () => {
    expect(movementController.canMove('up')).toBe(false)
  })
})
