import { PathTraversal } from '../PathTraversal'
import { MovementController } from '../MovementController'

// Mock dependencies
jest.mock('../MovementController')
jest.mock('../mapFunctions', () => ({
  findStart: jest.fn(() => ({ x: 0, y: 0 })),
  findEndPosition: jest.fn(() => true),
  getCurrentChar: jest.fn((map, y, x) => map[y][x]),
  validateSingleStart: jest.fn()
}))

describe('PathTraversal', () => {
  let pathTraversal: PathTraversal
  let mockMovementController: jest.Mocked<MovementController>

  beforeEach(() => {
    const map = [['@', '-', 'A', '-', 'x']] as MapGrid
    const MockedMovementController = MovementController as jest.MockedClass<typeof MovementController>
    mockMovementController = new MockedMovementController(map, { x: 0, y: 0 }) as jest.Mocked<MovementController>
    pathTraversal = new PathTraversal(map) as PathTraversal

    pathTraversal.movementController = mockMovementController
    pathTraversal.direction = 'right'

    // Setup canMove mock to return true for right movement from the start
    mockMovementController.canMove.mockImplementation((direction: string) => {
      const position = mockMovementController.getCurrentPosition()
      if (direction === 'right' && position.x < map[0].length - 1) {
        return true
      }
      return false
    })

    // Setup move mock to update the position
    mockMovementController.move.mockImplementation((direction: string) => {
      const position = mockMovementController.getCurrentPosition()
      if (direction === 'right') {
        mockMovementController.getCurrentPosition.mockReturnValue({ x: position.x + 1, y: position.y })
      }
    })

    jest.requireMock('../mapFunctions').getCurrentChar.mockImplementation((map: MapGrid, y:number, x:number) => {
      return map[y][x]
    })
  })

  test('traverse should collect letters and form a path', () => {
    mockMovementController.getCurrentPosition.mockReturnValue({ x: 0, y: 0 })
    const result = pathTraversal.traverse()
    expect(result.letters).toBe('A')
    expect(result.path).toBe('@-A-x')
  })
})
