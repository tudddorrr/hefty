import UserFactory from './fixtures/UserFactory'

describe('default states', () => {
  it('should apply the default state', async () => {
    const userFactory = new UserFactory()
    expect((await userFactory.one()).onboarded).toBe(false)
    expect((await userFactory.one()).emailConfirmed).toBe(false)
    expect((await userFactory.one()).type).toBe('basic')
  })
})
