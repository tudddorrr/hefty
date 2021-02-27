import { Factory } from '../../lib/Factory'
import Player from './Player'

export default class PlayerFactory extends Factory<Player> {
  constructor(defaultState?: string) {
    super(Player, defaultState)

    this.register('base', this.base)
  }

  protected base(entity: Player, idx: number, players: Player[]): Partial<Player> {
    return {
      id: idx,
      friendCount: players.length
    }
  }
}
