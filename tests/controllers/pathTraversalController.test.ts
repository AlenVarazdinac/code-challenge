import { MapController } from '@/controllers/MapController'
import { PathTraversal } from '@/controllers/PathTraversalController'
import { maps } from '@/data/mapData'

describe('PathTraversal', () => {
  let mapController: MapController
  beforeAll(() => {
    mapController = MapController.getInstance()
  })

  // Valid maps
  test('Basic example', () => {
    const map = maps['map1']

    mapController.map = map

    const traversal = new PathTraversal()
    const result = traversal.traverse()
    expect(result.letters).toBe('ACB')
    expect(result.path).toBe('@---A---+|C|+---+|+-B-x')
  })

  test('Go straight through intersections', () => {
    const map = maps['map2']

    mapController.map = map

    const traversal = new PathTraversal()
    const result = traversal.traverse()
    expect(result.letters).toBe('ABCD')
    expect(result.path).toBe('@|A+---B--+|+--C-+|-||+---D--+|x')
  })

  test('Letters may be found on turns', () => {
    const map = maps['map3']

    mapController.map = map

    const traversal = new PathTraversal()
    const result = traversal.traverse()
    expect(result.letters).toBe('ACB')
    expect(result.path).toBe('@---A---+|||C---+|+-B-x')
  })

  test('Do not collect a letter from the same location twice', () => {
    const map = maps['map4']

    mapController.map = map

    const traversal = new PathTraversal()
    const result = traversal.traverse()
    expect(result.letters).toBe('GOONIES')
    expect(result.path).toBe('@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x')
  })

  test('Keep direction, even in a compact space', () => {
    const map = maps['map5']

    mapController.map = map

    const traversal = new PathTraversal()
    const result = traversal.traverse()
    expect(result.letters).toBe('BLAH')
    expect(result.path).toBe('@B+++B|+-L-+A+++A-+Hx')
  })

  test('Ignore stuff after end of path', () => {
    const map = maps['map6']

    mapController.map = map

    const traversal = new PathTraversal()
    const result = traversal.traverse()
    expect(result.letters).toBe('AB')
    expect(result.path).toBe('@-A--+|+-B--x')
  })

  // Invalid maps
  test('Missing start character', () => {
    const map = [
      [' ', ' ', ' ', '-', 'A', '-', '-', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    mapController.map = map

    expect(() => new PathTraversal()).toThrow('Missing start character')
  })

  test('Missing end character', () => {
    const map = [
      ['@', '-', '-', 'A', '-', '-', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      [' ', ' ', 'B', '-', '+', ' ', ' ', 'C'],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', '+', '-', '-', '+']
    ]

    mapController.map = map

    expect(() => new PathTraversal()).toThrow('End character not found')
  })

  test('Multiple starts', () => {
    let map = [
      ['@', '-', '-', 'A', '-', '@', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['x', '-', 'B', '-', '+', ' ', ' ', 'C'],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', '+', '-', '-', '+']
    ]

    mapController.map = map
    expect(() => new PathTraversal()).toThrow('Multiple starts')

    map = [
      ['@', '-', '-', 'A', '-', '-', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'C'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x'],
      [' ', ' ', ' ', '@', '-', 'B', '-', '+']
    ]

    mapController.map = map
    expect(() => new PathTraversal()).toThrow('Multiple starts')

    map = [
      [' ', '@', '-', '-', 'A', '-', '-', 'x'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['x', '-', 'B', '-', '+', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', '@', ' ', ' ', ' ']
    ]

    mapController.map = map
    expect(() => new PathTraversal()).toThrow('Multiple starts')
  })

  test('Fork in path', () => {
    const map = [
      [' ', ' ', ' ', ' ', ' ', 'x', '-', 'B'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['@', '-', '-', 'A', '-', '-', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      [' ', ' ', 'x', '+', ' ', ' ', ' ', 'C'],
      [' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
      [' ', ' ', ' ', '+', '-', '-', '-', '+'],
    ]

    mapController.map = map

    const traversal = new PathTraversal()
    expect(() => traversal.traverse()).toThrow('Fork in path')
  })

  test('Broken path', () => {
    const map = [
      ['@', '-', '-', 'A', '-', '+', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', '|', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', 'B', '-', 'x']
    ]

    mapController.map = map

    const traversal = new PathTraversal()
    expect(() => traversal.traverse()).toThrow('Broken path')
  })

  test('Multiple starting paths', () => {
    const map = [
      ['x', '-', 'B', '-', '@', '-', 'A', '-', 'x']
    ]

    mapController.map = map

    const traversal = new PathTraversal()
    expect(() => traversal.traverse()).toThrow('Multiple starting paths')
  })

  test('Fake turn', () => {
    const map = [
      ['@', '-', 'A', '-', '+', '-', 'B', '-', 'x']
    ]

    mapController.map = map

    const traversal = new PathTraversal()
    expect(() => traversal.traverse()).toThrow('Fake turn')
  })
})
