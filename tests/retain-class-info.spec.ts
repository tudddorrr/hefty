import UserFactory from './fixtures/UserFactory'
import User from './fixtures/User'

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
    expect(await userFactory.onboarded().one()).toBeInstanceOf(User)
  })

  it('should retain class info with many states', async () => {
    expect(await userFactory.onboarded().emailConfirmed().one()).toBeInstanceOf(User)
  })

  it('should retain class info with overrides', async () => {
    expect(await userFactory.state(() => ({ name: 'Bob' })).one()).toBeInstanceOf(User)
  })

  it('should retain class info with states and overrides', async () => {
    expect(await userFactory.emailConfirmed().state(() => ({ name: 'Bob' })).one()).toBeInstanceOf(User)
  })

  it('should retain class info with states and overrides for many entities', async () => {
    const users = await userFactory.emailConfirmed().state(() => ({ name: 'Bob' })).many(3)
    for (let user of users) {
      expect(user).toBeInstanceOf(User)
    }
  })
})
