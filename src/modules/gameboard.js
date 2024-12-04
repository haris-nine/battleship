import Ship from './ship'

class Gameboard {
  constructor() {
    this.ships = []
    this.missedAttacks = []
  }

  placeShip(length, x, y, isHorizontal = true) {
    const ship = new Ship(length)
    const coordinates = []

    for (let i = 0; i < length; i++) {
      const coordinate = isHorizontal ? { x: x + i, y: y } : { x: x, y: y + i }
      coordinates.push(coordinate)
    }

    const isOverlapping = this.ships.some((existingShip) =>
      existingShip.coordinates.some((existingCoord) =>
        coordinates.some(
          (newCoord) =>
            existingCoord.x === newCoord.x && existingCoord.y === newCoord.y
        )
      )
    )

    if (isOverlapping) {
      throw new Error('Ship placement overlaps with existing ships')
    }

    ship.coordinates = coordinates
    this.ships.push(ship)
    return ship
  }

  receiveAttack(x, y) {
    for (const ship of this.ships) {
      const hitCoordinate = ship.coordinates.find(
        (coord) => coord.x === x && coord.y === y
      )

      if (hitCoordinate) {
        ship.hit()
        return true
      }
    }

    this.missedAttacks.push({ x, y })
    return false
  }

  allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk())
  }
}

export default Gameboard
