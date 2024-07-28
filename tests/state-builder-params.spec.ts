import PlayerFactory from './fixtures/PlayerFactory'
import Game from './fixtures/Game'
import Player from './fixtures/Player'

describe('state builder params', () => {
  it('should pass in the current entity, the current index and all other entities to the state function', async () => {
    const playerFactory = new PlayerFactory('base')
    let count = 0
    for (let player of await playerFactory.construct(new Game).many(5)) {
      expect(player.id).toBe(count)
      expect(player.friendCount).toBe(5)
      count++
    }
  })

  it('should pass in the current entity, the current index and all other entities to the with function', async () => {
    const playerFactory = new PlayerFactory()
    const players = await playerFactory.construct(new Game).with((entity: Player, idx: number, players: Player[]) => ({
      id: idx,
      friendCount: players.length
    })).many(5)

    let count = 0
    for (let player of players) {
      expect(player.id).toBe(count)
      expect(player.friendCount).toBe(5)
      count++
    }
  })
})
