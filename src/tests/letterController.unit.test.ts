import { LetterController } from '../LetterController'

describe('LetterController', () => {
  let letterController: LetterController

  beforeEach(() => {
    letterController = new LetterController()
  })

  test('collectLetter should add a new letter', () => {
    letterController.collectLetter('A', { x: 0, y: 0 })
    expect(letterController.getCollectedLetters()).toBe('A')
  })

  test('collectLetter should not add duplicate letters', () => {
    letterController.collectLetter('A', { x: 0, y: 0 })
    letterController.collectLetter('A', { x: 0, y: 0 })
    expect(letterController.getCollectedLetters()).toBe('A')
  })

  test('collectLetter should add multiple different letters', () => {
    letterController.collectLetter('A', { x: 0, y: 0 })
    letterController.collectLetter('B', { x: 1, y: 1 })
    expect(letterController.getCollectedLetters()).toBe('AB')
  })

  test('collectLetter should not add non-letter characters', () => {
    letterController.collectLetter('-', { x: 0, y: 0 })
    expect(letterController.getCollectedLetters()).toBe('')
  })
})
