class Ship {
  constructor(name, length) {
    this.name = name
    this.length = length
    this.hits = 0
    this.isSunk = false
  }

  hit() {
    this.hits++
    if (this.hits === this.length) {
      this.isSunk = true
    }
  }
}

export default Ship
