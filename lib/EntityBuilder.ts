import { StatesRegistry, StateBuilder } from './State'

export class EntityBuilder<T> {
  private states: StatesRegistry<T>
  private builders: StateBuilder<T>[] = []
  private args: string[]
  private Entity: new (...args) => T

  constructor(states: StatesRegistry<T>, Entity: new (...args) => T, ...args: any[]) {
    this.states = states
    this.args = args
    this.Entity = Entity
  }

  private build(entities: T[]): T[] {
    return entities.map((entity: T, idx: number) => {
      for (let builder of this.builders) {
        Object.assign(entity, builder(entity, idx))
      }
      return entity
    })
  }

  private makeEntity(): T {
    return new this.Entity(...this.args)
  }

  state(stateName: string): EntityBuilder<T> {
    if (this.states?.[stateName]) {
      this.builders.push(this.states[stateName])
      return this
    } else {
      const message = `No state named "${stateName}" was found. Did you forget to register it?`
      throw new Error(message)
    }
  }

  with(builder: StateBuilder<T>) {
    this.builders.push(builder)
    return this
  }

  one(): T {
    return this.build([this.makeEntity()])[0]
  }

  many(count: number): T[] {
    return this.build([...new Array(count)].map(() => this.makeEntity()))
  }
}
