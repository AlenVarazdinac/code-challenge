class BrokenPathError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BrokenPathError'
  }
}

class InfiniteLoopError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InfiniteLoopError'
  }
}

class NoValidPathError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NoValidPathError'
  }
}
