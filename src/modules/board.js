class Board {
  constructor(size = 10) {
    this.size = size
    this.grid = Array(size)
      .fill()
      .map(() => Array(size).fill(null))
    this.ships = []
  }

  placeShip(ship, startX, startY, isHorizontal) {
    if (!this.canPlaceShip(ship, startX, startY, isHorizontal)) {
      return false
    }

    for (let i = 0; i < ship.length; i++) {
      const x = isHorizontal ? startX + i : startX
      const y = isHorizontal ? startY : startY + i
      this.grid[y][x] = ship
    }

    this.ships.push(ship)
    return true
  }

  canPlaceShip(ship, startX, startY, isHorizontal) {
    for (let i = 0; i < ship.length; i++) {
      const x = isHorizontal ? startX + i : startX
      const y = isHorizontal ? startY : startY + i

      if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
        return false
      }

      if (this.grid[y][x] !== null) {
        return false
      }

      const adjacentCells = [
        [y - 1, x],
        [y + 1, x],
        [y, x - 1],
        [y, x + 1],
        [y - 1, x - 1],
        [y - 1, x + 1],
        [y + 1, x - 1],
        [y + 1, x + 1],
      ]

      for (const [adjY, adjX] of adjacentCells) {
        if (adjY >= 0 && adjY < this.size && adjX >= 0 && adjX < this.size) {
          if (this.grid[adjY][adjX] !== null) {
            return false
          }
        }
      }
    }
    return true
  }

  receiveAttack(x, y) {
    const target = this.grid[y][x]

    if (target === null) {
      return { hit: false }
    }

    target.hit()
    this.grid[y][x] = 'hit'

    return {
      hit: true,
      ship: target,
      isSunk: target.isSunk,
    }
  }

  getAllShipsSunk() {
    return this.ships.every((ship) => ship.isSunk)
  }
}

export default Board
