import { Factory } from '../../lib/Factory'
import User from './User'

export default class UserFactory extends Factory<User> {
  constructor(...defaults: string[]) {
    super(User, ...defaults)

    this.register('onboarded', this.onboarded)
    this.register('email confirmed', this.emailConfirmed)
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
}