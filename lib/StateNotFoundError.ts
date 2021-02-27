export class StateNotFoundError extends Error {
  constructor(stateName: string) {
    super(`No state named "${stateName}" was found. Did you forget to register it?`)
  }
}
