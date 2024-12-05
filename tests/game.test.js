import Game from '../src/modules/game.js'
import Board from '../src/modules/board.js'
import Ship from '../src/modules/ship.js'

describe('Game Class', () => {
  let game

  beforeEach(() => {
    game = new Game()
  })

  test('should initialize game with player and computer boards and ships', () => {
    expect(game.playerBoard).toBeInstanceOf(Board)
    expect(game.computerBoard).toBeInstanceOf(Board)
    expect(game.playerShips).toHaveLength(5)
    expect(game.computerShips).toHaveLength(5)

    const expectedShipNames = [
      'Carrier',
      'Battleship',
      'Cruiser',
      'Submarine',
      'Destroyer',
    ]
    const expectedShipLengths = [5, 4, 3, 3, 2]

    game.playerShips.forEach((ship, index) => {
      expect(ship).toBeInstanceOf(Ship)
      expect(ship.name).toBe(expectedShipNames[index])
      expect(ship.length).toBe(expectedShipLengths[index])
    })
  })

  test('computerAttack should perform a random attack on player board', () => {
    game.playerBoard.placeShip(game.playerShips[0], 0, 0, true)

    const attackResult = game.computerAttack()

    expect(attackResult).toHaveProperty('x')
    expect(attackResult).toHaveProperty('y')
    expect(attackResult).toHaveProperty('result')
    expect(attackResult.result.hit).toEqual(false)
  })
})
