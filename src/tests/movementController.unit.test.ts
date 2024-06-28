import { MapController } from '../MapController'
import { MovementController } from '../MovementController'

describe('MovementController', () => {
  let movementController: MovementController
  let mapController: MapController

  beforeAll(() => {
    const map = [
      ['@', '-', 'A', '-', '+'],
      [' ', ' ', ' ', ' ', '|'],
      ['x', '-', 'B', '-', '@']
    ]
    mapController = MapController.getInstance()
    mapController.map = map
  })

  beforeEach(() => {
    movementController = new MovementController({ x: 0, y: 0 })
  })

  test('getCurrentPosition should return the current position', () => {
    expect(movementController.getCurrentPosition()).toEqual({ x: 0, y: 0 })
  })

  test('move should update the current position', () => {
    movementController.move()
    expect(movementController.getCurrentPosition()).toEqual({ x: 1, y: 0 })
  })

  test('move should throw Broken Path error when moving to empty space', () => {
    movementController['currentPosition'] = { x: 0, y: 1 }
    movementController['direction'] = 'right'

    expect(() => movementController.move()).toThrow('Broken path')
  })

  test('canMove should return true for valid moves', () => {
    expect(movementController.canMove('right')).toBe(true)
  })

  test('canMove should return false for invalid moves', () => {
    expect(movementController.canMove('up')).toBe(false)
  })

  describe('changeDirection', () => {
    test('should throw error on fake turn', () => {
      movementController['currentPosition'] = { x: 2, y: 0 }
      movementController['direction'] = 'right'
      mapController.getCurrentChar = jest.fn().mockReturnValue('+')
      movementController.canMove = jest.fn().mockReturnValue(true)

      expect(() => movementController.changeDirection()).toThrow('Fake turn')
    })

    test('should change direction at intersection when current direction is blocked', () => {
      movementController['currentPosition'] = { x: 2, y: 0 }
      movementController['direction'] = 'right'
      mapController.getCurrentChar = jest.fn().mockReturnValue('+')
      movementController.canMove = jest
        .fn()
        .mockImplementation((dir) => dir === 'down')

      movementController.changeDirection()
      expect(movementController['direction']).toBe('down')
    })
  })

  describe('changeDirectionAtIntersection', () => {
    test('should throw error when multiple valid directions are found', () => {
      movementController['direction'] = 'right'
      movementController.canMove = jest
        .fn()
        .mockImplementation((dir) => ['up', 'down'].includes(dir))

      expect(() =>
        movementController['changeDirectionAtIntersection']()
      ).toThrow('Fork in path')
    })

    test('should throw error when no valid direction is found', () => {
      movementController['direction'] = 'right'
      movementController.canMove = jest.fn().mockReturnValue(false)

      expect(() =>
        movementController['changeDirectionAtIntersection']()
      ).toThrow('No valid direction found at intersection')
    })
  })
})
