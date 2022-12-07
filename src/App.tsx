import { useState, useEffect } from "react"

import Snake from "./components/Snake"

import "./App.scss"

const ARENA_SIZE_X = 500
const ARENA_SIZE_Y = 500
const SNAKE_PART_SIZE = 20
const RATIO_X = ARENA_SIZE_X / SNAKE_PART_SIZE
const RATIO_Y = ARENA_SIZE_Y / SNAKE_PART_SIZE

const devToolsActivated = true

const FOOD_TYPES = ["egg", "chicken"]
const BASE_SNAKE = ["head", "body_1", "tail"]

const INITIAL_SNAKEPOSITION = {
	x: 0,
	y: 0,
	dir: "right"
}
const SNAKE_POSITION_HISTORY: any[] = []

const registerMovement = (handleEvent: any) =>
	document.addEventListener("keydown", handleEvent)

const App = () => {
	const setFoodX = Math.floor(Math.random() * RATIO_X) * SNAKE_PART_SIZE
	const setFoodY = Math.floor(Math.random() * RATIO_Y) * SNAKE_PART_SIZE

	const [score, setScore] = useState(0)
	const [level, setLevel] = useState(1)
	const [snakeHeadPosition, setSnakeHeadPosition] = useState(
		INITIAL_SNAKEPOSITION
	)
	const [tickCounter, setTickCounter] = useState(0)
	const [snake, setSnake] = useState(BASE_SNAKE)
	const [foodPosition, setFoodPosition] = useState({
		x: setFoodX,
		y: setFoodY
	})

	const [gameOver, setGameOver] = useState(false)

	useEffect(() => {
		registerMovement(handleMovement)
	}, [])

	useEffect(() => {
		SNAKE_POSITION_HISTORY.unshift(snakeHeadPosition)
		if (SNAKE_POSITION_HISTORY.length > snake.length - 1)
			SNAKE_POSITION_HISTORY.splice(snake.length - 1)
	}, [snakeHeadPosition])

	const snakeHeadPositionetter = (
		previousState: any,
		axis: string,
		direction: number,
		orientation: string
	) => {
		return {
			...previousState,
			x:
				axis === "x"
					? previousState.x + SNAKE_PART_SIZE * direction
					: previousState.x,
			y:
				axis === "y"
					? previousState.y + SNAKE_PART_SIZE * direction
					: previousState.y,
			dir: orientation
		}
	}

	const gameIsOver = () => {
		setGameOver(true)
		setSnakeHeadPosition(INITIAL_SNAKEPOSITION)
	}

	const foodIsEaten = () => {
		setScore(score => score + 1)
		setFoodPosition({
			x: setFoodX,
			y: setFoodY
		})
		return
	}

	if (
		snakeHeadPosition.x === foodPosition.x &&
		snakeHeadPosition.y === foodPosition.y
	)
		foodIsEaten()

	if (
		snakeHeadPosition.x < 0 ||
		snakeHeadPosition.y < 0 ||
		snakeHeadPosition.x >= ARENA_SIZE_X ||
		snakeHeadPosition.y >= ARENA_SIZE_Y
	)
		gameIsOver()

	const handleMovement = (event: any) => {
		const { key } = event

		if (key === "ArrowRight") {
			setSnakeHeadPosition((previousState: any) => {
				if (previousState.dir === "left") return previousState
				return snakeHeadPositionetter(previousState, "x", 1, "right")
			})
		}
		if (key === "ArrowLeft") {
			setSnakeHeadPosition((previousState: any) => {
				if (previousState.dir === "right") return previousState
				return snakeHeadPositionetter(previousState, "x", -1, "left")
			})
		}
		if (key === "ArrowDown") {
			setSnakeHeadPosition((previousState: any) => {
				if (previousState.dir === "up") return previousState
				return snakeHeadPositionetter(previousState, "y", 1, "down")
			})
		}
		if (key === "ArrowUp") {
			setSnakeHeadPosition((previousState: any) => {
				if (previousState.dir === "down") return previousState
				return snakeHeadPositionetter(previousState, "y", -1, "up")
			})
		}
		setTickCounter(tick => tick + 1)
	}

	return (
		<div className="App">
			<div className="score">Score: {score}</div>
			{!gameOver && (
				<>
					<div
						className="arena devMode"
						style={{ width: `${ARENA_SIZE_X}px`, height: `${ARENA_SIZE_Y}px` }}
					>
						{snake.map((snakePart: string, index: number) => {
							return (
								<Snake
									snakeHeadPosition={snakeHeadPosition}
									snakeBodyPartPosition={SNAKE_POSITION_HISTORY}
									snakePartSize={SNAKE_PART_SIZE}
									snakePart={snakePart}
									key={snakePart}
									index={index}
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
					{devToolsActivated && (
						<div className="devTools">
							<p>
								Snake Head Location: {snakeHeadPosition.x}x |{" "}
								{snakeHeadPosition.y}y
							</p>
							<p>{"History (newest <-> oldest)"}</p>
							<div>
								{SNAKE_POSITION_HISTORY.map((positionData, index) => (
									<div className="historyBox" key={index}>
										<p>
											Bodypart: {positionData.x}x | {positionData.y}y
										</p>
										<p>Orientation: {positionData.dir}</p>
									</div>
								))}
							</div>
						</div>
					)}
				</>
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
