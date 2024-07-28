import PlayerFactory from './fixtures/PlayerFactory'
import Game from './fixtures/Game'
import Player from './fixtures/Player'

describe('classes with constructors', () => {
  const playerFactory = new PlayerFactory()
  const game = new Game()

  it('should create a default entity with constructors', async () => {
    expect((await playerFactory.construct(game).one()).game).toEqual({ name: 'Crawle' })
  })

  it('should create many default entities with constructors', async () => {
    const players: Player[] = await playerFactory.construct(game).many(3)
    expect(players).toHaveLength(3)

    for (let player of players) {
      expect(player.game).toEqual({ name: 'Crawle' })
    }
  })
})