import { isLetter, getOppositeDirection, checkForInfiniteLoop } from '../utils'
import { CONSTANTS } from '../constants'

describe('utils', () => {
  describe('isLetter', () => {
    test('should return true for uppercase letters', () => {
      expect(isLetter('A')).toBe(true)
      expect(isLetter('Z')).toBe(true)
    })

    test('should return true for "x"', () => {
      expect(isLetter('x')).toBe(true)
    })

    test('should return false for non-letters', () => {
      expect(isLetter('1')).toBe(false)
      expect(isLetter('@')).toBe(false)
      expect(isLetter(' ')).toBe(false)
    })
  })

  describe('getOppositeDirection', () => {
    test('should return correct opposite directions', () => {
      expect(getOppositeDirection('up')).toBe('down')
      expect(getOppositeDirection('down')).toBe('up')
      expect(getOppositeDirection('left')).toBe('right')
      expect(getOppositeDirection('right')).toBe('left')
    })
  })

  describe('checkForInfiniteLoop', () => {
    test('should throw error when iterations exceed max', () => {
      expect(() => checkForInfiniteLoop(CONSTANTS.MAX_ITERATIONS + 1)).toThrow(
        'Possible infinite loop detected'
      )
    })

    test('should not throw error when iterations are below max', () => {
      expect(() =>
        checkForInfiniteLoop(CONSTANTS.MAX_ITERATIONS - 1)
      ).not.toThrow()
    })
  })
})
