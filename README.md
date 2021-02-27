# Hefty
Easy, unopinionated and intuitive Typescript fixtures.

## Installation
`yarn add hefty --dev`

## Usage
Hefty lets you create factories, chain multiple states and override those states too. Check out the tests for more examples.

### Create a Factory
States need to be registered in the constructor of your factory. States (and `with()`) are called with the same params you get with `Array.map()`.

```
// User.ts
class User {
  email: string
  emailConfirmed: boolean
  onboarded: boolean
}

// UserFactory.ts
import { Factory } from 'hefty'

class UserFactory extends Factory<User> {
  constructor() {
    super(User)

    this.register('email confirmed', this.hasConfirmed)
    this.register('onboarded', this.hasOnboarded)
  }

  hasConfirmed(entity?: User, idx?: number): Partial<User> {
    return {
      emailConfirmed: true
    }
  }

  hasOnboarded(entity?: User, idx?: number): Partial<User> {
    return {
      onboarded: true
    }
  }
}
```

### Create some users
```
const factory = new UserFactory()

const user1: User = factory.one()
// -> emailConfirmed = false

const user2: User = factory.state('email confirmed').one()
// -> emailConfirmed = true

const user3: User = factory.state('email confirmed').state('onboarded').one()
// -> emailConfirmed = true, onboarded = true

const user4: User = factory.state('email confirmed).with(() => ({ email: hello@web.site })).one()
// -> emailConfirmed = true, email = hello@web.site

const users: User[] = factory.state('email confirmed').many(3)
// -> generates 3 users with emailConfirmed = true
```

`state()` and `with()` can be chained as many times as you like in any order. They'll all be applied sequentially when `one()` or `many()` is called.

### Entities with constructors
```
const factory = new UserFactory()

const user: User = factory.build(new Company(), 'Jane Doe').state('email confirmed).one()
```

Any params passed to `build()` are passed to the constructor for each entity.

### Factories with default states
```
// UserFactory.ts
export default class UserFactory extends Factory<User> {
  constructor(...defaults: string[]) {
    super(User, 'base', ...defaults)

    this.register('base', this.base)
    this.register('onboarded', this.onboarded)
    this.register('email confirmed', this.emailConfirmed)
  }

  base(): Partial<User> {
    return {
      createdAt: 'today'
    }
  }

  onboarded(): Partial<User> {
    return {
      onboarded: true
    }
  }

  emailConfirmed(): Partial<User> {
    return {
      emailConfirmed: true
    }
  }
}

const factory = new UserFactory('email confirmed')
// => createdAt = today, emailConfirmed: true 
```

Any extra strings you pass to the factory base class will be treated as default states. These will be applied before any other states/overrides.
