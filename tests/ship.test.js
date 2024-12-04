import Ship from '../src/modules/ship'

describe('Ship', () => {
  describe('constructor', () => {
    it('creates a ship with the correct length', () => {
      const ship = new Ship(3)
      expect(ship.length).toBe(3)
    })

    it('initializes hits to 0', () => {
      const ship = new Ship(4)
      expect(ship.hits).toBe(0)
    })
  })

  describe('hit()', () => {
    it('increases hits by 1 when hit', () => {
      const ship = new Ship(3)
      ship.hit()
      expect(ship.hits).toBe(1)
    })

    it('can be hit multiple times', () => {
      const ship = new Ship(3)
      ship.hit()
      ship.hit()
      expect(ship.hits).toBe(2)
    })
  })

  describe('isSunk()', () => {
    it('returns false when hits are less than ship length', () => {
      const ship = new Ship(3)
      ship.hit()
      ship.hit()
      expect(ship.isSunk()).toBe(false)
    })

    it('returns true when hits equal ship length', () => {
      const ship = new Ship(3)
      ship.hit()
      ship.hit()
      ship.hit()
      expect(ship.isSunk()).toBe(true)
    })

    it('returns true when hits exceed ship length', () => {
      const ship = new Ship(3)
      ship.hit()
      ship.hit()
      ship.hit()
      ship.hit()
      expect(ship.isSunk()).toBe(true)
    })
  })
})
