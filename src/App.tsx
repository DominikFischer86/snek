import { useState, useEffect, useCallback } from "react"

import { useInterval } from "./hooks/useInterval"

import Snake from "./components/Snake"
import Score from "./components/Score"
import GameOver from "./components/GameOver"
import Food from "./components/Food"

import "./App.scss"

const ARENA_SIZE_X = 500
const ARENA_SIZE_Y = 500
const SNAKE_PART_SIZE = 20
const SNAKE_SPEED = 100
const RATIO_X = ARENA_SIZE_X / SNAKE_PART_SIZE
const RATIO_Y = ARENA_SIZE_Y / SNAKE_PART_SIZE

const FOOD_TYPES = ["egg", "chicken", "steak"]
const SCORE_PER_FOOD_TYPE = [1, 2, 5]
const BASE_SNAKE = ["head", "body_0", "tail"]

const INITIAL_SNAKEPOSITION = {
	x: 0,
	y: 0,
	dir: "right"
}
const SNAKE_POSITION_HISTORY: any[] = []

const getFoodLocation = () => {
	const setFoodX = Math.floor(Math.random() * RATIO_X) * SNAKE_PART_SIZE
	const setFoodY = Math.floor(Math.random() * RATIO_Y) * SNAKE_PART_SIZE
	return { x: setFoodX, y: setFoodY }
}

const registerMovement = (handleEvent: any, gameOver: boolean) => {
	gameOver
		? document.removeEventListener("keydown", handleEvent)
		: document.addEventListener("keydown", handleEvent)
}

const App = () => {
	const [score, setScore] = useState(0)
	const [level, setLevel] = useState(0)
	const [snakeHeadPosition, setSnakeHeadPosition] = useState(INITIAL_SNAKEPOSITION)
	const [snake, setSnake] = useState(BASE_SNAKE)
	const [food, setFood] = useState(FOOD_TYPES[0])
	const [gameOver, setGameOver] = useState(false)
	const [foodPosition, setFoodPosition] = useState({
		x: getFoodLocation().x,
		y: getFoodLocation().y
	})

	useInterval(() => {
		setSnakeHeadPosition((previousState: any) => {
			if (previousState.dir === "left")
				return snakeHeadPositionSetter(previousState, "x", -1, "left")
			if (previousState.dir === "right")
				return snakeHeadPositionSetter(previousState, "x", 1, "right")
			if (previousState.dir === "up") return snakeHeadPositionSetter(previousState, "y", -1, "up")
			if (previousState.dir === "down")
				return snakeHeadPositionSetter(previousState, "y", 1, "down")
		})
	}, SNAKE_SPEED)

	useEffect(() => {
		registerMovement(handleMovement, gameOver)
	}, [])

	useEffect(() => {
		SNAKE_POSITION_HISTORY.unshift(snakeHeadPosition)
		if (SNAKE_POSITION_HISTORY.length > snake.length - 1)
			SNAKE_POSITION_HISTORY.splice(snake.length - 1)
	}, [snakeHeadPosition])

	const snakeHeadPositionSetter = (
		previousState: any,
		axis: string,
		direction: number,
		orientation: string
	) => {
		return {
			...previousState,
			x:
				axis === "x" && direction !== 0
					? previousState.x + SNAKE_PART_SIZE * direction
					: previousState.x,
			y:
				axis === "y" && direction !== 0
					? previousState.y + SNAKE_PART_SIZE * direction
					: previousState.y,
			dir: orientation
		}
	}

	const gameIsOver = () => {
		setGameOver(true)
		setSnakeHeadPosition(INITIAL_SNAKEPOSITION)
	}

	const setFoodKind = () => {
		const threshold = Math.random()
		const foodIndex = threshold > 0.9 ? 2 : threshold > 0.7 ? 1 : 0

		return setFood(FOOD_TYPES[foodIndex])
	}

	const foodIsEaten = () => {
		setScore(score => score + SCORE_PER_FOOD_TYPE[FOOD_TYPES.indexOf(food)])
		setLevel(level => level + 1)
		setSnake(oldSnake => {
			const newSnake = oldSnake.slice(1)
			return ["head", `body-${level}`, ...newSnake]
		})

		const newFoodPositionX = getFoodLocation().x
		const newFoodPositionY = getFoodLocation().y

		if (
			SNAKE_POSITION_HISTORY.find(
				position => position.x === newFoodPositionX && position.y === newFoodPositionY
			)
		)
			return

		setFoodKind()
		setFoodPosition({
			x: newFoodPositionX,
			y: newFoodPositionY
		})
	}

	if (snakeHeadPosition?.x === foodPosition.x && snakeHeadPosition?.y === foodPosition.y)
		foodIsEaten()

	if (
		snakeHeadPosition.x < 0 ||
		snakeHeadPosition.y < 0 ||
		snakeHeadPosition.x >= ARENA_SIZE_X ||
		snakeHeadPosition.y >= ARENA_SIZE_Y
	)
		gameIsOver()

	if (
		SNAKE_POSITION_HISTORY.find(
			position => position.x === snakeHeadPosition.x && position.y === snakeHeadPosition.y
		)
	)
		gameIsOver()

	const handleMovement = useCallback((event: any) => {
		const { key, repeat } = event
		if (repeat) return

		if (key === "ArrowRight") {
			setSnakeHeadPosition((previousState: any) => {
				if (previousState.dir === "left")
					return snakeHeadPositionSetter(previousState, "x", -1, "left")
				return snakeHeadPositionSetter(previousState, "x", 1, "right")
			})
		}
		if (key === "ArrowLeft") {
			setSnakeHeadPosition((previousState: any) => {
				if (previousState.dir === "right")
					return snakeHeadPositionSetter(previousState, "x", 1, "right")
				return snakeHeadPositionSetter(previousState, "x", -1, "left")
			})
		}
		if (key === "ArrowDown") {
			setSnakeHeadPosition((previousState: any) => {
				if (previousState.dir === "up") return snakeHeadPositionSetter(previousState, "y", -1, "up")
				return snakeHeadPositionSetter(previousState, "y", 1, "down")
			})
		}
		if (key === "ArrowUp") {
			setSnakeHeadPosition((previousState: any) => {
				if (previousState.dir === "down")
					return snakeHeadPositionSetter(previousState, "y", 1, "down")
				return snakeHeadPositionSetter(previousState, "y", -1, "up")
			})
		}
	}, [])

	if (gameOver) document.removeEventListener("keydown", handleMovement)

	return (
		<div className="App">
			{!gameOver && (
				<>
					<div
						className="arena"
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
						<Food food={food} foodPosition={foodPosition} snakePartSize={SNAKE_PART_SIZE} />
					</div>
				</>
			)}
			{gameOver && <GameOver />}
			<Score score={score} level={level} />
		</div>
	)
}

export default App
