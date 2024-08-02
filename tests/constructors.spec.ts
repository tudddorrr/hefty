import GameFactory from './fixtures/GameFactory'
import PlayerFactory from './fixtures/PlayerFactory'
import UserFactory from './fixtures/UserFactory'

describe('constructors', () => {
  it('should apply constructor params', async () => {
    const playerFactory = new PlayerFactory()

    const users = await new UserFactory().many(3)
    const game = await new GameFactory(users).state(() => ({ name: 'Game 1' })).one()

    expect(((await playerFactory.construct(game).one()).game.name)).toBe('Game 1')
  })
})
