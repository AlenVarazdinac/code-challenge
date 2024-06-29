import { MapController } from '@/controllers/MapController'

describe('MapController', () => {
  let mapController: MapController

  beforeAll(() => {
    mapController = MapController.getInstance()
  })

  describe('findStart', () => {
    test('should find start position', () => {
      mapController.map = [
        ['@', '-', '-'],
        [' ', ' ', ' '],
        [' ', ' ', 'x']
      ]
      expect(mapController.findStart()).toEqual({ x: 0, y: 0 })
    })

    test('should throw error when start is missing', () => {
      mapController.map = [
        [' ', '-', '-'],
        [' ', ' ', ' '],
        [' ', ' ', 'x']
      ]
      expect(() => mapController.findStart()).toThrow('Missing start character')
    })
  })

  describe('validateSingleStart', () => {
    test('should not throw error for single start', () => {
      mapController.map = [
        ['@', '-', '-'],
        [' ', ' ', ' '],
        [' ', ' ', 'x']
      ]
      expect(() => mapController.validateSingleStart()).not.toThrow()
    })

    test('should throw error for multiple starts', () => {
      mapController.map = [
        ['@', '-', '-'],
        [' ', '@', ' '],
        [' ', ' ', 'x']
      ]
      expect(() => mapController.validateSingleStart()).toThrow('Multiple starts')
    })
  })

  describe('checkForMultipleStartingPaths', () => {
    test('should not throw error for single starting path', () => {
      const mockMovementController = {
        canMove: jest.fn().mockImplementation((dir) => dir === 'right')
      }
      expect(() =>
        mapController.checkForMultipleStartingPaths(mockMovementController as any)
      ).not.toThrow()
    })

    test('should throw error for multiple starting paths', () => {
      const mockMovementController = {
        canMove: jest.fn().mockImplementation((dir) => ['right', 'down'].includes(dir))
      }
      expect(() =>
        mapController.checkForMultipleStartingPaths(mockMovementController as any)
      ).toThrow('Multiple starting paths')
    })
  })

  describe('validateMap', () => {
    it('should not throw an error for a valid map', () => {
      const validMap = [
        ['@', '-', 'A'],
        [' ', ' ', '|'],
        ['x', '-', 'B']
      ]

      expect(() => {
        mapController.map = validMap
      }).not.toThrow()
    })

    it('should throw an error for a map with invalid character', () => {
      const invalidMap = [
        ['@', '-', 'A'],
        [' ', '!', '|'],
        ['x', '-', 'B']
      ]

      expect(() => {
        mapController.map = invalidMap
      }).toThrow("Invalid character '!' at position (1, 1)")
    })

    it('should throw an error for a map with lowercase letter', () => {
      const invalidMap = [
        ['@', '-', 'A'],
        [' ', ' ', '|'],
        ['x', '-', 'b']
      ]

      expect(() => {
        mapController.map = invalidMap
      }).toThrow("Invalid character 'b' at position (2, 2)")
    })
  })
})
