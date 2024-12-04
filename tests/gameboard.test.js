import Gameboard from '../src/modules/gameboard'
import Ship from '../src/modules/ship'

describe('Gameboard', () => {
  let gameboard

  beforeEach(() => {
    gameboard = new Gameboard()
  })

  describe('constructor', () => {
    it('initializes with empty ships and missed attacks arrays', () => {
      expect(gameboard.ships).toEqual([])
      expect(gameboard.missedAttacks).toEqual([])
    })
  })

  describe('placeShip', () => {
    it('creates a ship with correct length at specified coordinates', () => {
      const ship = gameboard.placeShip(3, 0, 0)

      expect(ship).toBeInstanceOf(Ship)
      expect(ship.length).toBe(3)
      expect(ship.coordinates).toEqual([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ])
    })

    it('can place ships vertically', () => {
      const ship = gameboard.placeShip(3, 0, 0, false)

      expect(ship.coordinates).toEqual([
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
      ])
    })

    it('prevents overlapping ship placements', () => {
      gameboard.placeShip(3, 0, 0)

      expect(() => {
        gameboard.placeShip(3, 1, 0)
      }).toThrow('Ship placement overlaps with existing ships')
    })

    it('adds placed ships to the ships array', () => {
      const ship1 = gameboard.placeShip(3, 0, 0)
      const ship2 = gameboard.placeShip(2, 4, 4)

      expect(gameboard.ships).toContain(ship1)
      expect(gameboard.ships).toContain(ship2)
      expect(gameboard.ships.length).toBe(2)
    })
  })

  describe('receiveAttack', () => {
    it('hits a ship when attack coordinates match', () => {
      const ship = gameboard.placeShip(3, 0, 0)

      const result = gameboard.receiveAttack(1, 0)

      expect(result).toBe(true)
      expect(ship.hits).toBe(1)
    })

    it('records missed attacks when no ship is hit', () => {
      gameboard.placeShip(3, 0, 0)

      const result = gameboard.receiveAttack(3, 3)

      expect(result).toBe(false)
      expect(gameboard.missedAttacks).toEqual([{ x: 3, y: 3 }])
    })

    it('can hit the same ship multiple times', () => {
      const ship = gameboard.placeShip(3, 0, 0)

      gameboard.receiveAttack(0, 0)
      gameboard.receiveAttack(1, 0)

      expect(ship.hits).toBe(2)
    })
  })

  describe('allShipsSunk', () => {
    it('returns false when not all ships are sunk', () => {
      const ship1 = gameboard.placeShip(2, 0, 0)
      const ship2 = gameboard.placeShip(3, 4, 4)

      ship1.hit()
      ship1.hit()

      expect(gameboard.allShipsSunk()).toBe(false)
    })

    it('returns true when all ships are sunk', () => {
      const ship1 = gameboard.placeShip(2, 0, 0)
      const ship2 = gameboard.placeShip(3, 4, 4)

      ship1.hit()
      ship1.hit()

      ship2.hit()
      ship2.hit()
      ship2.hit()

      expect(gameboard.allShipsSunk()).toBe(true)
    })
  })
})
