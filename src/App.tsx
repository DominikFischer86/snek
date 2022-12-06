import { useState, useEffect } from "react"

import "./App.css"

const ARENA_SIZE_X = 500
const ARENA_SIZE_Y = 500
const SNAKE_SIZE = 20
const RATIO_X = ARENA_SIZE_X / SNAKE_SIZE
const RATIO_Y = ARENA_SIZE_Y / SNAKE_SIZE

const FOOD_TYPES = ["egg", "chicken"]

const registerMovement = (handleEvent: any) =>
	document.addEventListener("keydown", handleEvent)

const App = () => {
	const setFoodX = Math.floor(Math.random() * RATIO_X) * SNAKE_SIZE
	const setFoodY = Math.floor(Math.random() * RATIO_Y) * SNAKE_SIZE

	const [score, setScore] = useState(0)
	const [snakePosition, setSnakePosition] = useState({ x: 0, y: 0 })
	const [foodPosition, setFoodPosition] = useState({
		x: setFoodX,
		y: setFoodY
	})
	const [snakeDirection, setSnakeDirection] = useState("right")
	const [gameOver, setGameOver] = useState(false)

	useEffect(() => {
		registerMovement(handleMovement)
	}, [])

	const gameIsOver = () => {
		setGameOver(true)
		setSnakePosition({ x: 0, y: 0 })
	}

	const foodIsEaten = () => {
		setScore(score => score + 1)
		setFoodPosition({
			x: setFoodX,
			y: setFoodY
		})
		return
	}

	if (snakePosition.x === foodPosition.x && snakePosition.y === foodPosition.y)
		foodIsEaten()

	if (
		snakePosition.x < 0 ||
		snakePosition.y < 0 ||
		snakePosition.x >= ARENA_SIZE_X ||
		snakePosition.y >= ARENA_SIZE_Y
	)
		gameIsOver()

	const handleMovement = (event: any) => {
		const { key } = event

		if (key === "ArrowRight") {
			setSnakeDirection("right")
			return setSnakePosition(prev => ({ ...prev, x: prev.x + SNAKE_SIZE }))
		}
		if (key === "ArrowLeft") {
			setSnakeDirection("left")
			return setSnakePosition(prev => ({ ...prev, x: prev.x - SNAKE_SIZE }))
		}
		if (key === "ArrowDown") {
			setSnakeDirection("down")
			return setSnakePosition(prev => ({ ...prev, y: prev.y + SNAKE_SIZE }))
		}
		if (key === "ArrowUp") {
			setSnakeDirection("up")
			return setSnakePosition(prev => ({ ...prev, y: prev.y - SNAKE_SIZE }))
		}
	}

	return (
		<div className="App">
			<div className="score">Score: {score}</div>
			{!gameOver && (
				<div
					className="arena"
					style={{ width: `${ARENA_SIZE_X}px`, height: `${ARENA_SIZE_Y}px` }}
				>
					<div
						className={`snek ${snakeDirection}`}
						style={{
							top: snakePosition.y,
							left: snakePosition.x,
							width: `${SNAKE_SIZE}px`,
							height: `${SNAKE_SIZE}px`
						}}
					></div>
					<div
						className="food egg"
						style={{
							top: foodPosition.y,
							left: foodPosition.x,
							width: `${SNAKE_SIZE}px`,
							height: `${SNAKE_SIZE}px`
						}}
					></div>
				</div>
			)}
			{gameOver && (
				<div className="game-over">
					<p>Game Over!</p>
				</div>
			)}
		</div>
	)
}

export default App
