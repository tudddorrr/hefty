export type StateBuilder<T> = (entity?: T, idx?: number) => Partial<T>

export interface StatesRegistry<T> {
  [name: string]: StateBuilder<T>
}