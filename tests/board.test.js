import Board from '../src/modules/board'
import Ship from '../src/modules/ship'

describe('Board Class', () => {
  let board
  let ship

  beforeEach(() => {
    board = new Board()
    ship = new Ship('Destroyer', 3)
  })

  describe('Constructor', () => {
    it('should create a board with default size 10', () => {
      expect(board.size).toBe(10)
      expect(board.grid.length).toBe(10)
      expect(board.grid[0].length).toBe(10)
    })

    it('should create a board with custom size', () => {
      const customBoard = new Board(8)
      expect(customBoard.size).toBe(8)
      expect(customBoard.grid.length).toBe(8)
      expect(customBoard.grid[0].length).toBe(8)
    })

    it('should initialize grid with null values', () => {
      board.grid.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toBeNull()
        })
      })
    })

    it('should start with an empty ships array', () => {
      expect(board.ships.length).toBe(0)
    })
  })

  describe('placeShip method', () => {
    it('should place a horizontal ship successfully', () => {
      const result = board.placeShip(ship, 2, 3, true)

      expect(result).toBe(true)
      expect(board.ships).toContain(ship)

      // Check ship placement
      expect(board.grid[3][2]).toBe(ship)
      expect(board.grid[3][3]).toBe(ship)
      expect(board.grid[3][4]).toBe(ship)
    })

    it('should place a vertical ship successfully', () => {
      const result = board.placeShip(ship, 2, 3, false)

      expect(result).toBe(true)
      expect(board.ships).toContain(ship)

      // Check ship placement
      expect(board.grid[3][2]).toBe(ship)
      expect(board.grid[4][2]).toBe(ship)
      expect(board.grid[5][2]).toBe(ship)
    })

    it('should not place a ship outside board boundaries', () => {
      const result = board.placeShip(ship, 8, 8, true)

      expect(result).toBe(false)
      expect(board.ships.length).toBe(0)
    })

    it('should not place a ship overlapping another ship', () => {
      const firstShip = new Ship('Cruiser', 4)
      board.placeShip(firstShip, 2, 3, true)

      const result = board.placeShip(ship, 3, 3, true)

      expect(result).toBe(false)
      expect(board.ships.length).toBe(1)
    })

    it('should not place a ship adjacent to another ship', () => {
      const firstShip = new Ship('Cruiser', 4)
      board.placeShip(firstShip, 2, 3, true)

      const result = board.placeShip(ship, 1, 2, false)

      expect(result).toBe(false)
      expect(board.ships.length).toBe(1)
    })
  })

  describe('canPlaceShip method', () => {
    it('should return true for valid ship placement', () => {
      const result = board.canPlaceShip(ship, 2, 3, true)
      expect(result).toBe(true)
    })

    it('should return false if ship is outside board horizontally', () => {
      const result = board.canPlaceShip(ship, 8, 3, true)
      expect(result).toBe(false)
    })

    it('should return false if ship is outside board vertically', () => {
      const result = board.canPlaceShip(ship, 3, 8, false)
      expect(result).toBe(false)
    })

    it('should return false if ship overlaps existing ship', () => {
      const firstShip = new Ship('Cruiser', 4)
      board.placeShip(firstShip, 2, 3, true)

      const result = board.canPlaceShip(ship, 3, 3, true)
      expect(result).toBe(false)
    })
  })

  describe('receiveAttack method', () => {
    it('should return miss for empty cell', () => {
      const result = board.receiveAttack(2, 3)

      expect(result).toEqual({ hit: false })
    })

    it('should hit ship and mark cell when attack is successful', () => {
      board.placeShip(ship, 2, 3, true)

      const result = board.receiveAttack(3, 3)

      expect(result).toEqual({
        hit: true,
        ship: ship,
        isSunk: false,
      })

      expect(board.grid[3][3]).toBe('hit')
      expect(ship.hits).toBe(1)
    })

    it('should mark ship as sunk when all hits are received', () => {
      board.placeShip(ship, 2, 3, true)

      board.receiveAttack(2, 3)
      board.receiveAttack(3, 3)
      const finalResult = board.receiveAttack(4, 3)

      expect(finalResult).toEqual({
        hit: true,
        ship: ship,
        isSunk: true,
      })

      expect(ship.isSunk).toBe(true)
    })
  })

  describe('getAllShipsSunk method', () => {
    it('should return false when not all ships are sunk', () => {
      const ship1 = new Ship('Destroyer', 3)
      const ship2 = new Ship('Cruiser', 4)

      board.placeShip(ship1, 2, 3, true)
      board.placeShip(ship2, 5, 6, false)

      board.receiveAttack(2, 3)
      board.receiveAttack(3, 3)
      board.receiveAttack(4, 3)

      expect(board.getAllShipsSunk()).toBe(false)
    })

    it('should return true when all ships are sunk', () => {
      const ship1 = new Ship('Destroyer', 2)
      const ship2 = new Ship('Cruiser', 3)

      board.placeShip(ship1, 2, 3, true)
      board.placeShip(ship2, 5, 6, false)

      // Sink first ship
      board.receiveAttack(2, 3)
      board.receiveAttack(3, 3)

      // Sink second ship
      board.receiveAttack(5, 6)
      board.receiveAttack(5, 7)
      board.receiveAttack(5, 8)

      expect(board.getAllShipsSunk()).toBe(true)
    })
  })
})
