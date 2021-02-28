import UserFactory from './fixtures/UserFactory'
import PlayerFactory from './fixtures/PlayerFactory'
import User from './fixtures/User'
import Game from './fixtures/Game'
import Player from './fixtures/Player'
import GameFactory from './fixtures/GameFactory'
import bcrypt from 'bcrypt'

describe('classes without constructors', () => {
  const userFactory = new UserFactory()

  it('should create a default entity', async () => {
    expect(await userFactory.one()).toBeInstanceOf(User)
  })

  it('should create many default entities', async () => {
    expect(await userFactory.many(3)).toHaveLength(3)
  })

  it('should create an entity with a registered state', async () => {
    expect((await userFactory.state('onboarded').one()).onboarded).toBe(true)
  })

  it('should create many entities with a registered state', async () => {
    const users: User[] = await userFactory.state('onboarded').many(3)
    for (let user of users) {
      expect(user.onboarded).toBe(true)
    }
  })

  it('should not create an entity with an unregistered state', async () => {
    const badState = 'asdbsada'

    try {
      await userFactory.state(badState).one()
    } catch (err) {
      expect(err.message).toBe(`No state named "${badState}" was found. Did you forget to register it?`)
    }
  })

  it('should be able to chain states', async () => {
    const user: User = await userFactory.state('onboarded').state('email confirmed').one()
    expect(user.onboarded).toBe(true)
    expect(user.emailConfirmed).toBe(true)
  })

  it('should be able to chain states with many entities', async () => {
    const users: User[] = await userFactory.state('onboarded').state('email confirmed').many(3)
    for (let user of users) {
      expect(user.onboarded).toBe(true)
      expect(user.emailConfirmed).toBe(true)
    }
  })

  it('should be able to override bases', async () => {
    const user: User = await userFactory.with(() => ({ onboarded: true })).one()
    expect(user.onboarded).toBe(true)
  })

  it('should be able to override bases many entities', async () => {
    const users: User[] = await userFactory.with(() => ({ onboarded: true })).many(3)
    for (let user of users) {
      expect(user.onboarded).toBe(true)
    }
  })

  it('should be able to override states', async () => {
    const user: User = await userFactory.state('onboarded').with(() => ({
      onboarded: false
    })).one()
    expect(user.onboarded).toBe(false)
  })

  it('should be able to override states with many entities', async () => {
    const users: User[] = await userFactory.state('onboarded').with(() => ({ onboarded: false })).many(3)
    for (let user of users) {
      expect(user.onboarded).toBe(false)
    }
  })
})

describe('classes with constructors', () => {
const playerFactory = new PlayerFactory()
  const game = new Game()

  it('should create a default entity with constructors', async () => {
    expect((await playerFactory.build(game).one()).game).toEqual({ name: 'Crawle' })
  })

  it('should create many default entities with constructors', async () => {
    const players: Player[] = await playerFactory.build(game).many(3)
    expect(players).toHaveLength(3)

    for (let player of players) {
      expect(player.game).toEqual({ name: 'Crawle' })
    }
  })
})

describe('retain class info', () => {
  const userFactory = new UserFactory()

  it('should retain class info for one entity', async () => {
    expect(await userFactory.one()).toBeInstanceOf(User)
  })

  it('should retain class info for one entity', async () => {
    for (let user of await userFactory.many(3)) {
      expect(user).toBeInstanceOf(User)
    }
  })

  it('should retain class info with a state', async () => {
    expect(await userFactory.state('onboarded').one()).toBeInstanceOf(User)
  })

  it('should retain class info with many states', async () => {
    expect(await userFactory.state('onboarded').state('email confirmed').one()).toBeInstanceOf(User)
  })

  it('should retain class info with overrides', async () => {
    expect(await userFactory.with(() => ({ name: 'Bob' })).one()).toBeInstanceOf(User)
  })

  it('should retain class info with states and overrides', async () => {
    expect(await userFactory.state('email confirmed').with(() => ({ name: 'Bob' })).one()).toBeInstanceOf(User)
  })

  it('should retain class info with states and overrides for many entities', async () => {
    const users = await userFactory.state('email confirmed').with(() => ({ name: 'Bob' })).many(3)
    for (let user of users) {
      expect(user).toBeInstanceOf(User)
    }
  })
})

describe('default states', () => {
  it('should apply a default state', async () => {
    const userFactory = new UserFactory('email confirmed')
    expect((await userFactory.one()).emailConfirmed).toBe(true)
  })

  it('should apply many default states', async () => {
    const userFactory = new UserFactory('email confirmed', 'onboarded')
    const user = await userFactory.one()
    expect(user.emailConfirmed).toBe(true)
    expect(user.onboarded).toBe(true)
  })

  it('should not apply any unregistered states', async () => {
    const badState = 'sdasdsad'
    const userFactory = new UserFactory(badState)

    try {
      await userFactory.one()
    } catch (err) {
      expect(err.message).toBe(`No state named "${badState}" was found. Did you forget to register it?`)
    }
  })
})

describe('state builder params', () => {
  it('should pass in the current entity, the current index and all other entities to the state function', async () => {
    const playerFactory = new PlayerFactory('base')
    let count = 0
    for (let player of await playerFactory.build(new Game).many(5)) {
      expect(player.id).toBe(count)
      expect(player.friendCount).toBe(5)
      count++
    }
  })

  it('should pass in the current entity, the current index and all other entities to the with function', async () => {
    const playerFactory = new PlayerFactory()
    const players = await playerFactory.build(new Game).with((entity: Player, idx: number, players: Player[]) => ({
      id: idx,
      friendCount: players.length
    })).many(5)

    let count = 0
    for (let player of players) {
      expect(player.id).toBe(count)
      expect(player.friendCount).toBe(5)
      count++
    }
  })
})

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

describe('async functions', () => {
  it('should resolve async states', async () => {
    const user = await new UserFactory().state('loginable').one()
    expect(user.password).toBeTruthy()
  })

  it('should resolve multiple async states', async () => {
    const user = await new UserFactory().state('loginable').state('admin').one()
    expect(user.email).toBe('admin@test.com')
    expect(user.type).toBe('admin')
  })

  it('should resolve default async states', async () => {
    const user = await new UserFactory('admin').one()
    expect(user.email).toBe('admin@test.com')
    expect(user.type).toBe('admin')
  })

  it('should resolve multiple async states for multiple entities', async () => {
    const users = await new UserFactory().state('loginable').state('admin').many(3)
    for (let user of users) {
      expect(user.email).toBe('admin@test.com')
      expect(user.type).toBe('admin')
    }
  })

  it('should resolve default async states for multiple entities', async () => {
    const users = await new UserFactory('admin').many(3)
    for (let user of users) {
      expect(user.email).toBe('admin@test.com')
      expect(user.type).toBe('admin')
    }
  })

  it('should resolve async overrides', async () => {
    const user = await new UserFactory().with(async () => ({
      password: await bcrypt.hash('password', 10)
    })).one()
    expect(user.password).toBeTruthy()
  })
})
