import UserFactory from './fixtures/UserFactory'
import PlayerFactory from './fixtures/PlayerFactory'
import User from './fixtures/User'
import Game from './fixtures/Game'
import Player from './fixtures/Player'

const userFactory = new UserFactory()
const playerFactory = new PlayerFactory()

describe('classes without constructors', () => {
  it('should create a default entity', () => {
    expect(userFactory.one()).toBeTruthy()
  })

  it('should create many default entities', () => {
    expect(userFactory.many(3)).toHaveLength(3)
  })

  it('should create an entity with a registered state', () => {
    expect(userFactory.state('onboarded').one().onboarded).toBe(true)
  })

  it('should create many entities with a registered state', () => {
    const users: User[] = userFactory.state('onboarded').many(3)
    for (let user of users) {
      expect(user.onboarded).toBe(true)
    }
  })

  it('should not create an entity with an unregistered state', () => {
    expect(() => userFactory.state('asdbsada').one()).toThrow(/Did you forget to register it?/)
  })

  it('should be able to chain states', () => {
    const user: User = userFactory.state('onboarded').state('email confirmed').one()
    expect(user.onboarded).toBe(true)
    expect(user.emailConfirmed).toBe(true)
  })

  it('should be able to chain states with many entities', () => {
    const users: User[] = userFactory.state('onboarded').state('email confirmed').many(3)
    for (let user of users) {
      expect(user.onboarded).toBe(true)
      expect(user.emailConfirmed).toBe(true)
    }
  })

  it('should be able to override bases', () => {
    const user: User = userFactory.with(() => ({ onboarded: true })).one()
    expect(user.onboarded).toBe(true)
  })

  it('should be able to override bases many entities', () => {
    const users: User[] = userFactory.with(() => ({ onboarded: true })).many(3)
    for (let user of users) {
      expect(user.onboarded).toBe(true)
    }
  })

  it('should be able to override states', () => {
    const user: User = userFactory.state('onboarded').with(() => ({
      onboarded: false
    })).one()
    expect(user.onboarded).toBe(false)
  })

  it('should be able to override states with many entities', () => {
    const users: User[] = userFactory.state('onboarded').with(() => ({ onboarded: false })).many(3)
    for (let user of users) {
      expect(user.onboarded).toBe(false)
    }
  })
})

describe('classes with constructors', () => {
  const game = new Game()

  it('should create a default entity with constructors', () => {
    expect(playerFactory.build(game).one().game).toEqual({ name: 'Crawle' })
  })

  it('should create many default entities with constructors', () => {
    const players: Player[] = playerFactory.build(game).many(3)
    expect(players).toHaveLength(3)

    for (let player of players) {
      expect(player.game).toEqual({ name: 'Crawle' })
    }
  })
})
