import { EntityBuilder } from './EntityBuilder'
import { StateBuilder, StatesRegistry } from './State'

interface Entity<T> {
  new (...args): T
}

export class Factory<T> {
  private states: StatesRegistry<T>
  private entity: Entity<T>

  constructor(entity: Entity<T>) {
    this.states = {}
    this.entity = entity
  }

  protected register(stateName: string, func: StateBuilder<T>) {
    this.states[stateName] = func
  }

  build(...args: any[]): EntityBuilder<T> {
    return new EntityBuilder<T>(this.states, this.entity, ...args)
  }

  state(stateName: string): EntityBuilder<T> {
    return new EntityBuilder<T>(this.states, this.entity).state(stateName)
  }

  with(builder: StateBuilder<T>): EntityBuilder<T> {
    return new EntityBuilder<T>(this.states, this.entity).with(builder)
  }

  one(): T {
    return new EntityBuilder<T>(this.states, this.entity).one()
  }

  many(count: number): T[] {
    return new EntityBuilder<T>(this.states, this.entity).many(count)
  }
}
