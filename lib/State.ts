export type StateBuilder<T> = (entity?: T, idx?: number, array?: T[]) => Partial<T> | Promise<Partial<T>>

export interface StatesRegistry<T> {
  [name: string]: StateBuilder<T>
}