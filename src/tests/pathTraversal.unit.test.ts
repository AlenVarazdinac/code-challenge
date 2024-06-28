import { PathTraversal } from '../PathTraversal'
import { MovementController } from '../MovementController'
import { MapController } from '../MapController'

jest.mock('../MovementController')

describe('PathTraversal', () => {
  let pathTraversal: PathTraversal
  let mockMapController: MapController
  let mockMovementController: jest.Mocked<MovementController>

  beforeEach(() => {
    const map = [['@', '-', 'A', '-', 'x']] as MapGrid

    mockMapController = MapController.getInstance()
    mockMapController.map = map

    const MockedMovementController = MovementController as jest.MockedClass<
      typeof MovementController
    >
    mockMovementController = new MockedMovementController({
      x: 0,
      y: 0
    }) as jest.Mocked<MovementController>
    pathTraversal = new PathTraversal() as PathTraversal

    pathTraversal.movementController = mockMovementController

    // Setup canMove mock to return true for right movement from the start
    mockMovementController.canMove.mockImplementation((direction: string) => {
      const position = mockMovementController.getCurrentPosition()
      if (direction === 'right' && position.x < map[0].length - 1) {
        return true
      }
      return false
    })

    // Setup move mock to update the position
    mockMovementController.move.mockImplementation(() => {
      const position = mockMovementController.getCurrentPosition()
      mockMovementController.getCurrentPosition.mockReturnValue({
        x: position.x + 1,
        y: position.y
      })
    })
  })

  test('traverse should collect letters and form a path', () => {
    mockMovementController.getCurrentPosition.mockReturnValue({ x: 0, y: 0 })
    const result = pathTraversal.traverse()
    expect(result.letters).toBe('A')
    expect(result.path).toBe('@-A-x')
  })
})
