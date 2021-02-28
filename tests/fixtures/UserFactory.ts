import { Factory } from '../../lib/Factory'
import User from './User'
import bcrypt from 'bcrypt'

export default class UserFactory extends Factory<User> {
  constructor(...defaults: string[]) {
    super(User, ...defaults)

    this.register('onboarded', this.onboarded)
    this.register('email confirmed', this.emailConfirmed)
    this.register('loginable', this.loginable)
    this.register('admin', this.admin)
  }

  protected onboarded(): Partial<User> {
    return {
      onboarded: true
    }
  }

  protected emailConfirmed(): Partial<User> {
    return {
      emailConfirmed: true
    }
  }

  protected async loginable(): Promise<Partial<User>> {
    return {
      password: await bcrypt.hash('password', 10)
    }
  }

  protected async admin(): Promise<Partial<User>> {
    return {
      email: 'admin@test.com',
      password: await bcrypt.hash('password', 10),
      type: 'admin'
    }
  }
}
