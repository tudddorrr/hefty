import UserFactory from './fixtures/UserFactory'
import GameFactory from './fixtures/GameFactory'

describe('preserving context', () => {
  const userFactory = new UserFactory()

  it('should preserve context for a public state', async () => {
    const users = await userFactory.many(10)
    const gameFactory = new GameFactory(users)
    expect((await gameFactory.state('team1').one()).teamMembers.length).toBeGreaterThan(0)
  })

  it('should preserve context for a protected state', async () => {
    const users = await userFactory.many(10)
    const gameFactory = new GameFactory(users)
    expect((await gameFactory.state('team2').one()).teamMembers.length).toBeGreaterThan(0)
  })

  it('should preserve context for a private state', async () => {
    const users = await userFactory.many(10)
    const gameFactory = new GameFactory(users)
    expect((await gameFactory.state('team3').one()).teamMembers.length).toBeGreaterThan(0)
  })
})
