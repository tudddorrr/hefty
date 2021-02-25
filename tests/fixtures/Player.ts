import Game from './Game'

export default class Player {
  game: Game
  name: string
  
  constructor(game: Game) {
    this.game = game
  }
}