import { PathTraversal } from './../src/PathTraversal'

describe('PathTraversal', () => {
  // Valid maps
  test('Basic example', () => {
    const map = [
      ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const traversal = new PathTraversal(map)
    const result = traversal.traverse()
    expect(result.letters).toBe('ACB')
    expect(result.path).toBe('@---A---+|C|+---+|+-B-x')
  })

  test('Go straight through intersections', () => {
    const map = [
      ['@', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['|', ' ', '+', '-', 'C', '-', '-', '+'],
      ['A', ' ', '|', ' ', ' ', ' ', ' ', '|'],
      ['+', '-', '-', '-', 'B', '-', '-', '+'],
      [' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', 'x'],
      [' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      [' ', ' ', '+', '-', '-', '-', 'D', '-', '-', '+']
    ]
    const traversal = new PathTraversal(map)
    const result = traversal.traverse()
    expect(result.letters).toBe('ABCD')
    expect(result.path).toBe('@|A+---B--+|+--C-+|-||+---D--+|x')
  })

  test('Letters may be found on turns', () => {
    const map = [
      ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['x', '-', 'B', '-', '+', ' ', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', '+', '-', '-', '-', 'C']
    ]
    const traversal = new PathTraversal(map)
    const result = traversal.traverse()
    expect(result.letters).toBe('ACB')
    expect(result.path).toBe('@---A---+|||C---+|+-B-x')
  })

  test('Do not collect a letter from the same location twice', () => {
    const map = [
      [' ', ' ', ' ', ' ', '+', '-', 'O', '-', 'N', '-', '+', ' ', ' '],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' '],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '+', '-', 'I', '-', '+'],
      ['@', '-', 'G', '-', 'O', '-', '+', ' ', '|', ' ', '|', ' ', '|'],
      [' ', ' ', ' ', ' ', '|', ' ', '|', ' ', '+', '-', '+', ' ', 'E'],
      [' ', ' ', ' ', ' ', '+', '-', '+', ' ', ' ', ' ', ' ', ' ', 'S'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x']
    ]
    const traversal = new PathTraversal(map)
    const result = traversal.traverse()
    expect(result.letters).toBe('GOONIES')
    expect(result.path).toBe('@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x')
  })

  test('Keep direction, even in a compact space', () => {
    const map = [
      [' ', '+', '-', 'L', '-', '+', ' ', ' '],
      [' ', '|', ' ', ' ', '+', 'A', '-', '+'],
      ['@', 'B', '+', ' ', '+', '+', ' ', 'H'],
      [' ', '+', '+', ' ', ' ', ' ', ' ', 'x']
    ]
    const traversal = new PathTraversal(map)
    const result = traversal.traverse()
    expect(result.letters).toBe('BLAH')
    expect(result.path).toBe('@B+++B|+-L-+A+++A-+Hx')
  })

  test('Ignore stuff after end of path', () => {
    const map = [
      ['@', '-', 'A', '-', '-', '+', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', '+', '-', 'B', '-', '-', 'x', '-', 'C', '-', '-', 'D']
    ]
    const traversal = new PathTraversal(map)
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
    expect(() => new PathTraversal(map)).toThrow('Missing start character')
  })

  test('Missing end character', () => {
    const map = [
      ['@', '-', '-', 'A', '-', '-', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      [' ', ' ', 'B', '-', '+', ' ', ' ', 'C'],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', '+', '-', '-', '+']
    ]
    expect(() => new PathTraversal(map)).toThrow('End character not found')
  })

  test('Multiple starts', () => {
    let map = [
      ['@', '-', '-', 'A', '-', '@', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['x', '-', 'B', '-', '+', ' ', ' ', 'C'],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', '+', '-', '-', '+']
    ]
    expect(() => new PathTraversal(map)).toThrow('Multiple starts')

    map = [
      ['@', '-', '-', 'A', '-', '-', '-', '+'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'C'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x'],
      [' ', ' ', ' ', '@', '-', 'B', '-', '+']
    ]
    expect(() => new PathTraversal(map)).toThrow('Multiple starts')

    map = [
      [' ', '@', '-', '-', 'A', '-', '-', 'x'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['x', '-', 'B', '-', '+', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', '|', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', '@', ' ', ' ', ' ']
    ]
    expect(() => new PathTraversal(map)).toThrow('Multiple starts')
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
    const traversal = new PathTraversal(map)
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
    const traversal = new PathTraversal(map)
    expect(() => traversal.traverse()).toThrow('Broken path')
  })

  test('Multiple starting paths', () => {
    const map = [
      ['x', '-', 'B', '-', '@', '-', 'A', '-', 'x']
    ]
    const traversal = new PathTraversal(map)
    expect(() => traversal.traverse()).toThrow('Multiple starting paths')
  })

  // TODO: Fix
  test('Fake turn', () => {
    const map = [
      ['@', '-', 'A', '-', '+', '-', 'B', '-', 'x']
    ]
    const traversal = new PathTraversal(map)
    expect(() => traversal.traverse()).toThrow('Fake turn')
  })
})
