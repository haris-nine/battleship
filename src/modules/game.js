import Ship from './ship.js'
import Board from './board.js'

class Game {
  constructor() {
    this.playerBoard = new Board()
    this.computerBoard = new Board()
    this.playerShips = [
      new Ship('Carrier', 5),
      new Ship('Battleship', 4),
      new Ship('Cruiser', 3),
      new Ship('Submarine', 3),
      new Ship('Destroyer', 2),
    ]
    this.computerShips = [
      new Ship('Carrier', 5),
      new Ship('Battleship', 4),
      new Ship('Cruiser', 3),
      new Ship('Submarine', 3),
      new Ship('Destroyer', 2),
    ]
  }

  setupComputerShips() {
    const ships = [...this.computerShips]

    while (ships.length > 0) {
      const ship = ships.pop()
      let placed = false

      while (!placed) {
        const startX = Math.floor(Math.random() * this.computerBoard.size)
        const startY = Math.floor(Math.random() * this.computerBoard.size)
        const isHorizontal = Math.random() > 0.5

        placed = this.computerBoard.placeShip(
          ship,
          startX,
          startY,
          isHorizontal
        )
      }
    }
  }

  computerAttack() {
    let x, y
    do {
      x = Math.floor(Math.random() * this.playerBoard.size)
      y = Math.floor(Math.random() * this.playerBoard.size)
    } while (
      this.playerBoard.grid[y][x] === 'hit' ||
      this.playerBoard.grid[y][x] === 'miss'
    )

    const result = this.playerBoard.receiveAttack(x, y)

    return {
      x,
      y,
      result,
    }
  }
}

export default Game
