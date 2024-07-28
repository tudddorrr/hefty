import UserFactory from './fixtures/UserFactory'
import User from './fixtures/User'

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
