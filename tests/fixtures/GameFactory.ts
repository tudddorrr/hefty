import { Factory } from '../../lib'
import Game from './Game'
import User from './User'
import casual from 'casual'

export default class GameFactory extends Factory<Game> {
  availableUsers: User[]

  constructor(availableUsers: User[]) {
    super(Game)
    this.availableUsers = availableUsers
  }

  team1() {
    const teamMembers = []
    teamMembers.push(...this.buildTeam())

    return this.state(async () => ({
      teamMembers
    }))
  }

  private buildTeam(): User[] {
    const count = casual.integer(1, 2)
    const users: User[] = [...new Array(count)].map(() => casual.random_element(this.availableUsers))
    return users
  }
}