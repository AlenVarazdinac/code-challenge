export class BrokenPathError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BrokenPathError'
  }
}
