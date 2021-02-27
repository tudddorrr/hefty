import Game from './Game'

export default class Player {
  id: number
  game: Game
  name: string
  friendCount: number
  
  constructor(game: Game) {
    this.game = game
  }
}