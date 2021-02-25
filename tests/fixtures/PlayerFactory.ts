import { Factory } from '../../lib/Factory'
import Player from './Player'

export default class PlayerFactory extends Factory<Player> {
  constructor() {
    super(Player)
  }
}
