import { EntityBuilder } from './EntityBuilder'
import { StateBuilder, StatesRegistry } from './State'

interface Entity<T> {
  new (...args): T
}

export class Factory<T> {
  private states: StatesRegistry<T>
  private entity: Entity<T>
  private defaults: string[]

  constructor(entity: Entity<T>, ...defaults: string[]) {
    this.states = {}
    this.entity = entity
    this.defaults = defaults
  }

  protected register(stateName: string, func: StateBuilder<T>) {
    const state = func.bind(this)
    this.states[stateName] = state
  }

  private createBuilder(...args: any[]): EntityBuilder<T>  {
    return new EntityBuilder(this.states, this.defaults, this.entity, ...args)
  }

  construct(...args: any[]): EntityBuilder<T> {
    return this.createBuilder(...args)
  }

  state(stateName: string): EntityBuilder<T> {
    return this.createBuilder().state(stateName)
  }

  with(builder: StateBuilder<T>): EntityBuilder<T> {
    return this.createBuilder().with(builder)
  }

  async one(): Promise<T> {
    return this.createBuilder().one()
  }

  async many(count: number): Promise<T[]> {
    return this.createBuilder().many(count)
  }
}
