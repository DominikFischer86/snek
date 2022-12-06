import { useState, useEffect } from "react"

import Snake from "./components/Snake"

import "./App.css"

const ARENA_SIZE_X = 500
const ARENA_SIZE_Y = 500
const SNAKE_PART_SIZE = 20
const RATIO_X = ARENA_SIZE_X / SNAKE_PART_SIZE
const RATIO_Y = ARENA_SIZE_Y / SNAKE_PART_SIZE

const FOOD_TYPES = ["egg", "chicken"]
const BASE_SNAKE = ["head", "body_1", "tail"]

const INITIAL_SNAKEPOSITIONS = {
	"level-1": {
		[BASE_SNAKE[0]]: { x: SNAKE_PART_SIZE * BASE_SNAKE.length, y: 0 },
		[BASE_SNAKE[1]]: {
			x: SNAKE_PART_SIZE * BASE_SNAKE.length - SNAKE_PART_SIZE,
			y: 0
		},
		[BASE_SNAKE[2]]: {
			x: SNAKE_PART_SIZE * BASE_SNAKE.length - SNAKE_PART_SIZE * 2,
			y: 0
		}
	}
}

const registerMovement = (handleEvent: any) =>
	document.addEventListener("keydown", handleEvent)

const SNAKE_POSITION_HISTORY: any[] = []

const App = () => {
	const setFoodX = Math.floor(Math.random() * RATIO_X) * SNAKE_PART_SIZE
	const setFoodY = Math.floor(Math.random() * RATIO_Y) * SNAKE_PART_SIZE

	const [score, setScore] = useState(0)
	const [level, setLevel] = useState(1)
	const [snakePositions, setSnakePositions] = useState(INITIAL_SNAKEPOSITIONS)
	const [tickCounter, setTickCounter] = useState(0)
	const [snake, setSnake] = useState(BASE_SNAKE)
	const [foodPosition, setFoodPosition] = useState({
		x: setFoodX,
		y: setFoodY
	})
	const [snakeHeadDirection, setSnakeHeadDirection] = useState("right")
	// const [lastSnakeHeadDirection, setLastSnakeHeadDirection] = useState("")
	const [gameOver, setGameOver] = useState(false)

	useEffect(() => {
		registerMovement(handleMovement)
	}, [])

	useEffect(() => {
		SNAKE_POSITION_HISTORY.push(snakePositions)
		if (SNAKE_POSITION_HISTORY.length > snake.length)
			SNAKE_POSITION_HISTORY.splice(-snake.length + 1)
	}, [snakePositions])

	console.log(SNAKE_POSITION_HISTORY)

	const snakePositionSetter = (
		previousState: any,
		axis: string,
		snakePart: string,
		direction: number
	) => {
		const lvl = `level-${level}`

		return {
			...previousState,
			...{
				[lvl]: {
					...previousState[lvl],
					...{
						[snakePart]: {
							x:
								axis === "x"
									? previousState[lvl][snakePart]?.x +
									  SNAKE_PART_SIZE * direction
									: previousState[lvl][snakePart]?.x,
							y:
								axis === "y"
									? previousState[lvl][snakePart]?.y +
									  SNAKE_PART_SIZE * direction
									: previousState[lvl][snakePart]?.y
						}
					}
				}
			}
		}
	}

	const gameIsOver = () => {
		setGameOver(true)
		setSnakePositions(INITIAL_SNAKEPOSITIONS)
	}

	const foodIsEaten = () => {
		setScore(score => score + 1)
		setFoodPosition({
			x: setFoodX,
			y: setFoodY
		})
		return
	}

	// if (
	// 	snakePositions.x === foodPosition.x &&
	// 	snakePositions.y === foodPosition.y
	// )
	// 	foodIsEaten()

	// if (
	// 	snakePositions.x < 0 ||
	// 	snakePositions.y < 0 ||
	// 	snakePositions.x >= ARENA_SIZE_X ||
	// 	snakePositions.y >= ARENA_SIZE_Y
	// )
	// 	gameIsOver()

	const handleMovement = (event: any) => {
		const { key } = event

		if (key === "ArrowRight") {
			setSnakeHeadDirection("right")
			snake.forEach((snakePart: string) =>
				setSnakePositions((previousState: any) =>
					snakePositionSetter(previousState, "x", snakePart, 1)
				)
			)
			setTickCounter(tick => tick + 1)
		}
		if (key === "ArrowLeft") {
			setSnakeHeadDirection("left")
			snake.forEach((snakePart: string) =>
				setSnakePositions((previousState: any) =>
					snakePositionSetter(previousState, "x", snakePart, -1)
				)
			)
			setTickCounter(tick => tick + 1)
		}
		if (key === "ArrowDown") {
			setSnakeHeadDirection("down")
			snake.forEach((snakePart: string) =>
				setSnakePositions((previousState: any) =>
					snakePositionSetter(previousState, "y", snakePart, 1)
				)
			)
			setTickCounter(tick => tick + 1)
		}
		if (key === "ArrowUp") {
			setSnakeHeadDirection("up")
			snake.forEach((snakePart: string) =>
				setSnakePositions((previousState: any) =>
					snakePositionSetter(previousState, "y", snakePart, -1)
				)
			)
			setTickCounter(tick => tick + 1)
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
					{snake.map((snakePart: string, index: number) => {
						return (
							<Snake
								snakeHeadDirection={snakeHeadDirection}
								snakePositions={snakePositions}
								snakeSize={SNAKE_PART_SIZE}
								snakePart={snakePart}
								level={`level-${level}`}
								key={snakePart}
							/>
						)
					})}

					<div
						className="food egg"
						style={{
							top: foodPosition.y,
							left: foodPosition.x,
							width: `${SNAKE_PART_SIZE}px`,
							height: `${SNAKE_PART_SIZE}px`
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
