import { Factory } from '../../lib/Factory'
import Player from './Player'

export default class PlayerFactory extends Factory<Player> {
  constructor() {
    super(Player)
  }

  definition() {
    this.state(async (player: Player, idx: number, players: Player[]) => ({
      id: idx,
      friendCount: players.length
    }))
  }
}
