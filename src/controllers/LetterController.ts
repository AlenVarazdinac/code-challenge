import { isLetter } from '../utils/utils'

export class LetterController {
  private collectedLetters: CollectedLetter[] = []

  public collectLetter(char: string, position: Position): void {
    if (isLetter(char) && !this.isLetterAlreadyCollected(char, position)) {
      this.collectedLetters.push({ letter: char, position })
    }
  }

  public getCollectedLetters(): string {
    return this.collectedLetters
      .map((collectedLetter) => collectedLetter.letter)
      .join('')
  }

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
