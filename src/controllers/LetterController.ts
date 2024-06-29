import { isLetter } from '../utils/utils'

export class LetterController {
  private collectedLetters: CollectedLetter[] = []

  /**
   * Collects a letter at given position if it is valid and hasn't been collected already
   * @param {string} char - Character to check
   * @param {Position} position - Position of the character on the map
   */
  public collectLetter(char: string, position: Position): void {
    if (isLetter(char) && !this.isLetterAlreadyCollected(char, position)) {
      this.collectedLetters.push({ letter: char, position })
    }
  }

  /**
   * Retrieves all collected letters as a single string
   * @returns {string} Collected letters in the order they were collected
   */
  public getCollectedLetters(): string {
    return this.collectedLetters
      .map((collectedLetter) => collectedLetter.letter)
      .join('')
  }

  /**
   * Checks if a letter has already been collected at the given position
   * @param {string} letter - Letter to check
   * @param {Position} position - Position to check
   * @returns {boolean} True if the letter has already been collected at the given position, otherwise false
   */
  private isLetterAlreadyCollected(
    letter: string,
    position: Position
  ): boolean {
    return this.collectedLetters.some(
      (collectedLetter) =>
        collectedLetter.letter === letter &&
        collectedLetter.position.x === position.x &&
        collectedLetter.position.y === position.y
    )
  }
}
