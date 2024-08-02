# Hefty
Easy, unopinionated and intuitive Typescript fixtures.

## Installation
`npm install hefty --save-dev`

## Usage
Hefty lets you create factories, chain multiple states and override those states too. Check out the tests for more examples.

### Create a Factory
Factories are made up of entities with one or more states applied to them. States are called with the same params you get with `Array.map()`.

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
  }

  hasConfirmed(): this {
    return this.state(() => ({
      emailConfirmed: true
    }))
  }

  hasOnboarded(): this {
    return this.state(() => ({
      onboarded: true
    }))
  }
}
```

### Create some users
```
const factory = new UserFactory()

const user1: User = await factory.one()
// -> emailConfirmed = false

const user2: User = await factory.emailConfirmed().one()
// -> emailConfirmed = true

const user3: User = await factory.emailConfirmed().onboarded().one()
// -> emailConfirmed = true, onboarded = true

const user4: User = await factory.emailConfirmed().state(() => ({ email: hello@web.site })).one()
// -> emailConfirmed = true, email = hello@web.site

const users: User[] = await factory.emailConfirmed().many(3)
// -> generates 3 users with emailConfirmed = true
```

State functions defined in the factory and `state()` can be chained as many times as you like in any order. They'll all be applied sequentially when `one()` or `many()` is called.

### Factories with default states
Factories can implement a `definition()` function that is called before any other states are applied.

```
export default class UserFactory extends Factory<User> {
  constructor() {
    super(User)
  }

  protected definition(): void {
    this.state(() => {
      createdAt: 'today',
      emailConfirmed: true
    })
  }

  onboarded(): this {
    return this.state(() => ({
      onboarded: true
    }))
  }

  emailConfirmed(): this {
    return this.state(() => ({
      emailConfirmed: true
    }))
  }
}

const factory = await new UserFactory().one()
// => createdAt = today, emailConfirmed: true 
```

### Promises
Hefty will automatically resolve any promise-based `state()` callbacks.

```
export default class UserFactory extends Factory<User> {
  constructor() {
    super(User)
  }

  protected definition(): void {
    this.state(async () => ({
      password: await bcrypt.hash('password', 10)
    }))
  }
}
```

### Constructors
You can pass constructor params to the `construct()` function. Entities will be initialised with these params before the definition is applied.

```
// User.ts
class User {
  email: string

  constructor(email: string) {
    this.email = email
  }
}

// User.test.ts
const email = 'hello@mail.com'
expect((await new UserFactory().construct(email).one()).email).toBe(email)
```
