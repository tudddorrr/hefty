import UserFactory from './fixtures/UserFactory'

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
