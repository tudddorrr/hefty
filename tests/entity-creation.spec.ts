import UserFactory from './fixtures/UserFactory'
import User from './fixtures/User'
import PlayerFactory from './fixtures/PlayerFactory'
import Game from './fixtures/Game'
import Player from './fixtures/Player'

describe('entity creation', () => {
  const userFactory = new UserFactory()

  it('should create a default entity', async () => {
    expect(await userFactory.one()).toBeInstanceOf(User)
  })

  it('should create many default entities', async () => {
    expect(await userFactory.many(3)).toHaveLength(3)
  })

  it('should create an entity with a defined state', async () => {
    expect((await userFactory.onboarded().one()).onboarded).toBe(true)
  })

  it('should create many entities with a defined state', async () => {
    const users: User[] = await userFactory.onboarded().many(3)
    for (let user of users) {
      expect(user.onboarded).toBe(true)
    }
  })

  it('should be able to chain states', async () => {
    const user: User = await userFactory.onboarded().emailConfirmed().one()
    expect(user.onboarded).toBe(true)
    expect(user.emailConfirmed).toBe(true)
  })

  it('should be able to chain states with many entities', async () => {
    const users: User[] = await userFactory.onboarded().emailConfirmed().many(3)
    for (let user of users) {
      expect(user.onboarded).toBe(true)
      expect(user.emailConfirmed).toBe(true)
    }
  })

  it('should be able to override bases', async () => {
    const user: User = await userFactory.state(() => ({ onboarded: true })).one()
    expect(user.onboarded).toBe(true)
  })

  it('should be able to override bases many entities', async () => {
    const users: User[] = await userFactory.state(() => ({ onboarded: true })).many(3)
    for (let user of users) {
      expect(user.onboarded).toBe(true)
    }
  })

  it('should be able to override states', async () => {
    const user: User = await userFactory.onboarded().state(() => ({
      onboarded: false
    })).one()
    expect(user.onboarded).toBe(false)
  })

  it('should be able to override states with many entities', async () => {
    const users: User[] = await userFactory.onboarded().state(() => ({ onboarded: false })).many(3)
    for (let user of users) {
      expect(user.onboarded).toBe(false)
    }
  })

  it('should create a default entity for classes with constructors', async () => {
    const playerFactory = new PlayerFactory()
    const game = new Game()

    expect((await playerFactory.state(() => ({ game })).one()).game).toEqual({ name: 'Crawle' })
  })

  it('should create many default entities for classes with constructors', async () => {
    const playerFactory = new PlayerFactory()
    const game = new Game()

    const players: Player[] = await playerFactory.state(() => ({ game })).many(3)
    expect(players).toHaveLength(3)

    for (let player of players) {
      expect(player.game).toEqual({ name: 'Crawle' })
    }
  })
})
