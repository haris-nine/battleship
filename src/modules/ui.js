import Game from './game.js'

class GameUI {
  constructor() {
    this.game = new Game()
    this.playerBoard = document.getElementById('player-board')
    this.computerBoard = document.getElementById('computer-board')
    this.gameMessage = document.getElementById('game-message')
    this.shipsRemainingElement = document.getElementById('ships-remaining')
    this.startGameButton = document.getElementById('start-game')
    this.resetGameButton = document.getElementById('reset-game')
    this.rotateShipButton = document.getElementById('rotate-ship')

    this.currentShipIndex = 0
    this.isPlacingShips = true
    this.isGameStarted = false
    this.isPlayerTurn = true
    this.isHorizontal = true

    this.initializeBoards()
    this.bindEvents()
    this.updateShipsRemainingDisplay()
  }

  updateShipsRemainingDisplay() {
    const unplacedShips = this.game.playerShips.slice(
      this.currentShipIndex
    ).length
    const placedAndAlive = this.game.playerShips.filter(
      (ship) => ship.hits.length < ship.length
    ).length

    this.shipsRemainingElement.textContent = `Ships remaining: ${this.isPlacingShips ? unplacedShips : placedAndAlive}`
  }

  initializeBoards() {
    this.playerBoard.innerHTML = ''
    this.computerBoard.innerHTML = ''

    this.createBoard(this.playerBoard, true)
    this.createBoard(this.computerBoard, false)
  }

  createBoard(boardElement, isPlayerBoard) {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.dataset.x = x
        cell.dataset.y = y

        if (isPlayerBoard) {
          cell.addEventListener('click', () =>
            this.handlePlayerShipPlacement(x, y)
          )
        } else {
          cell.addEventListener('click', () =>
            this.handleComputerBoardAttack(x, y)
          )
        }

        boardElement.appendChild(cell)
      }
    }
  }

  handlePlayerShipPlacement(x, y) {
    if (!this.isPlacingShips) return

    const currentShip = this.game.playerShips[this.currentShipIndex]

    if (this.game.playerBoard.placeShip(currentShip, x, y, this.isHorizontal)) {
      this.highlightShipOnBoard(
        x,
        y,
        currentShip.length,
        this.isHorizontal,
        this.playerBoard
      )

      this.currentShipIndex++
      this.updateShipsRemainingDisplay()

      if (this.currentShipIndex >= this.game.playerShips.length) {
        this.isPlacingShips = false
        this.gameMessage.textContent = 'All ships placed. Click Start Game!'
        this.startGameButton.disabled = false
        this.rotateShipButton.disabled = true
      } else {
        const nextShip = this.game.playerShips[this.currentShipIndex]
        this.gameMessage.textContent = `Place your ${nextShip.name} (Length: ${nextShip.length})`
      }
    } else {
      this.gameMessage.textContent =
        'Cannot place ship here. Try another location.'
    }
  }

  rotateShip() {
    if (!this.isPlacingShips) return

    this.isHorizontal = !this.isHorizontal
    this.gameMessage.textContent = this.isHorizontal
      ? 'Ship orientation: Horizontal'
      : 'Ship orientation: Vertical'
  }

  highlightShipOnBoard(startX, startY, length, isHorizontal, boardElement) {
    for (let i = 0; i < length; i++) {
      const x = isHorizontal ? startX + i : startX
      const y = isHorizontal ? startY : startY + i

      const cell = boardElement.querySelector(`[data-x="${x}"][data-y="${y}"]`)
      if (cell) {
        cell.classList.add('ship')
        cell.classList.add(isHorizontal ? 'horizontal' : 'vertical')
      }
    }
  }

  handleComputerBoardAttack(x, y) {
    if (!this.isGameStarted || !this.isPlayerTurn) return

    const cell = this.computerBoard.querySelector(
      `[data-x="${x}"][data-y="${y}"]`
    )

    if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
      return
    }

    const result = this.game.computerBoard.receiveAttack(x, y)

    if (result.hit) {
      cell.classList.add('hit')
      this.gameMessage.textContent = 'You hit a ship!'

      if (result.isSunk) {
        this.gameMessage.textContent = `You sunk the ${result.ship.name}!`
      }

      if (this.game.computerBoard.getAllShipsSunk()) {
        this.endGame(true)
        return
      }
    } else {
      cell.classList.add('miss')
      this.gameMessage.textContent = 'Miss!'
    }

    this.isPlayerTurn = false
    this.computerTurn()
  }

  computerTurn() {
    setTimeout(() => {
      const attackResult = this.game.computerAttack()
      const playerCell = this.playerBoard.querySelector(
        `[data-x="${attackResult.x}"][data-y="${attackResult.y}"]`
      )

      if (attackResult.result.hit) {
        playerCell.classList.add('hit')
        this.gameMessage.textContent = 'Computer hit your ship!'

        if (attackResult.result.isSunk) {
          this.gameMessage.textContent = `Computer sunk your ${attackResult.result.ship.name}!`
        }

        if (this.game.playerBoard.getAllShipsSunk()) {
          this.endGame(false)
          return
        }
      } else {
        playerCell.classList.add('miss')
        this.gameMessage.textContent = 'Computer missed!'
      }

      this.isPlayerTurn = true
    }, 1000)
  }

  startGame() {
    if (this.currentShipIndex < this.game.playerShips.length) {
      this.gameMessage.textContent = 'Please place all your ships first!'
      return
    }

    this.game.setupComputerShips()
    this.isGameStarted = true
    this.isPlayerTurn = true
    this.startGameButton.disabled = true
    this.gameMessage.textContent = 'Game started. Your turn to attack!'
    this.updateShipsRemainingDisplay()
  }

  resetGame() {
    this.game = new Game()
    this.currentShipIndex = 0
    this.isPlacingShips = true
    this.isGameStarted = false
    this.isPlayerTurn = true

    this.playerBoard.innerHTML = ''
    this.computerBoard.innerHTML = ''

    this.gameMessage.textContent = 'Place your ships!'
    this.startGameButton.disabled = false
    this.resetGameButton.disabled = true
    this.rotateShipButton.disabled = false

    this.initializeBoards()

    this.updateShipsRemainingDisplay()

    this.gameMessage.textContent = `Place your ${this.game.playerShips[0].name} (Length: ${this.game.playerShips[0].length}) - Horizontal`
  }

  endGame(playerWon) {
    this.isGameStarted = false
    this.isPlayerTurn = false

    if (playerWon) {
      this.gameMessage.textContent = 'Congratulations! You won the game!'
    } else {
      this.gameMessage.textContent = 'Game Over. Computer wins!'
    }

    this.resetGameButton.disabled = false
  }

  bindEvents() {
    this.startGameButton.addEventListener('click', () => this.startGame())
    this.resetGameButton.addEventListener('click', () => this.resetGame())
    this.rotateShipButton.addEventListener('click', () => this.rotateShip())

    this.startGameButton.disabled = true
    this.resetGameButton.disabled = true
    this.rotateShipButton.disabled = false
  }
}

export default GameUI
