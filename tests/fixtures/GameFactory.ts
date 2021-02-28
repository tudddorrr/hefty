import { Factory } from '../../lib'
import Game from './Game'
import User from './User'
import casual from 'casual'

export default class GameFactory extends Factory<Game> {
  availableUsers: User[]

  constructor(availableUsers: User[]) {
    super(Game)
    this.availableUsers = availableUsers

    this.register('team1', this.team1)
    this.register('team2', this.team2)
    this.register('team3', this.team3)
  }

  team1(game: Game): Partial<Game> {
    const teamMembers = []
    teamMembers.push(...this.buildTeam())

    return {
      teamMembers
    }
  }

  protected team2(game: Game): Partial<Game> {
    const teamMembers = []
    teamMembers.push(...this.buildTeam())

    return {
      teamMembers
    }
  }

  private team3(game: Game): Partial<Game> {
    const teamMembers = []
    teamMembers.push(...this.buildTeam())

    return {
      teamMembers
    }
  }

  private buildTeam(): User[] {
    const count = casual.integer(1, 2)
    const users: User[] = [...new Array(count)].map(() => casual.random_element(this.availableUsers))
    return users
  }
}