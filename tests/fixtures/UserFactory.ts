import { Factory } from '../../lib/Factory'
import User from './User'
import bcrypt from 'bcrypt'

export default class UserFactory extends Factory<User> {
  constructor() {
    super(User)
  }

  protected definition(): void {
    this.state(() => ({
      onboarded: false,
      emailConfirmed: false,
      type: 'basic'
    }))
  }

  onboarded() {
    return this.state(() => ({
      onboarded: true
    }))
  }

  emailConfirmed() {
    return this.state(() => ({
      emailConfirmed: true
    }))
  }

  loginable() {
    return this.state(async () => ({
      password: await bcrypt.hash('password', 10)
    }))
  }

  admin() {
    return this.state(async () => ({
      email: 'admin@test.com',
      password: await bcrypt.hash('password', 10),
      type: 'admin'
    }))
  }
}
