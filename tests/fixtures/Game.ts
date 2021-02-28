import User from './User'

export default class Game {
  name: string
  teamMembers: User[]

  constructor() {
    this.name = 'Crawle'
  }
}
