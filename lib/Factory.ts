type Entity<T> = {
  new (...args: any[]): T
}

type StateBuilder<T> = (entity: T, idx: number, entities: T[]) => Partial<T> | Promise<Partial<T>>

export class Factory<T> {
  private entity: Entity<T>
  private states: StateBuilder<T>[] = []
  private params: unknown[] = []

  constructor(entity: Entity<T>) {
    this.entity = entity
  }

  state(builder: StateBuilder<T>): this {
    this.states.push(builder)
    return this
  }

  construct(...params: unknown[]): this {
    this.params = params
    return this
  }

  protected definition(): void {
    this.state(() => ({}))
  }

  private async applyDefinition(entity: T, idx: number, entities: T[]): Promise<T> {
    this.definition()
    return Object.assign(entity, await this.states.pop()(entity, idx, entities))
  }

  private async applyStates(entity: T, idx: number, entities: T[]): Promise<T> {
    entity = await this.applyDefinition(entity, idx, entities)

    for (let state of this.states) {
      entity = Object.assign(entity, await state(entity, idx, entities))
    }

    return entity
  }

  private makeEntity(): T {
    return new this.entity(...this.params)
  }

  async one<F extends Factory<T>>(this: F): Promise<T> {
    const entity = this.makeEntity()
    return await this.applyStates(entity, 0, [entity])
  }

  async many<F extends Factory<T>>(this: F, count: number): Promise<T[]> {
    const entities = Array.from({ length: count }, () => this.makeEntity())
    for (let idx = 0; idx < entities.length; idx++) {
      entities[idx] = await this.applyStates(entities[idx], idx, entities)
    }

    return entities
  }
}
