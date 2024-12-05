import Ship from '../src/modules/ship'

describe('Ship Class', () => {
  describe('Constructor', () => {
    it('should create a ship with the correct properties', () => {
      const ship = new Ship('Destroyer', 3)

      expect(ship.name).toBe('Destroyer')
      expect(ship.length).toBe(3)
      expect(ship.hits).toBe(0)
      expect(ship.isSunk).toBe(false)
    })
  })

  describe('hit() method', () => {
    it('should increment hits when hit() is called', () => {
      const ship = new Ship('Cruiser', 4)

      ship.hit()
      expect(ship.hits).toBe(1)

      ship.hit()
      expect(ship.hits).toBe(2)
    })

    it('should mark ship as sunk when hits equal length', () => {
      const ship = new Ship('Submarine', 3)

      ship.hit()
      ship.hit()
      expect(ship.isSunk).toBe(false)

      ship.hit()
      expect(ship.isSunk).toBe(true)
    })

    it('should not mark ship as sunk before hits reach length', () => {
      const ship = new Ship('Battleship', 5)

      ship.hit()
      ship.hit()
      ship.hit()
      ship.hit()
      expect(ship.isSunk).toBe(false)
    })
  })

  describe('isSunk property', () => {
    it('should remain false when hits are less than ship length', () => {
      const ship = new Ship('Patrol Boat', 2)

      ship.hit()
      expect(ship.isSunk).toBe(false)
    })

    it('should become true when hits equal ship length', () => {
      const ship = new Ship('Aircraft Carrier', 5)

      for (let i = 0; i < 5; i++) {
        ship.hit()
      }

      expect(ship.isSunk).toBe(true)
    })
  })
})
