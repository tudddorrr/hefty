import UserFactory from './fixtures/UserFactory'
import bcrypt from 'bcrypt'

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
