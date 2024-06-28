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
})
