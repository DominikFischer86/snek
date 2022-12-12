import { useState, useEffect, useCallback, useRef } from "react"

import { SnakePositionPropTypes } from "./configs/interfaces"

import { useInterval } from "./hooks/useInterval"
import { useLocalStorage } from "./hooks/useLocalStorage"

import Snake from "./components/Snake"
import Score from "./components/Score"
import GameOver from "./components/GameOver"
import Food from "./components/Food"
import Controls from "./components/Controls"
import StartScreen from "./components/StartScreen"

import {
	SNAKE_PART_SIZE,
	RATIO_X,
	RATIO_Y,
	BASE_SNAKE,
	SNAKE_SPEED,
	INITIAL_SNAKEPOSITION,
	SNAKE_POSITION_HISTORY,
	FOOD_TYPES,
	SCORE_PER_FOOD_TYPE,
	ARENA_SIZE_X,
	ARENA_SIZE_Y
} from "./configs/gameConfig"

import "./App.scss"

const getFoodLocation = () => {
	const setFoodX = Math.floor(Math.random() * RATIO_X) * SNAKE_PART_SIZE
	const setFoodY = Math.floor(Math.random() * RATIO_Y) * SNAKE_PART_SIZE
	return { x: setFoodX, y: setFoodY }
}

const registerMovement = (handleEvent: (event: Event) => void, gameOver: boolean) => {
	gameOver
		? document.removeEventListener("keydown", handleEvent)
		: document.addEventListener("keydown", handleEvent)
}

const App = () => {
	const [score, setScore] = useState(0)
	const [level, setLevel] = useState(0)
	const [highScore, setHighScore] = useLocalStorage("highscore", 0)
	const [snakeHeadPosition, setSnakeHeadPosition] = useState(INITIAL_SNAKEPOSITION)
	const [snake, setSnake] = useState(BASE_SNAKE)
	const [food, setFood] = useState(FOOD_TYPES[0])
	const [activeKey, setActiveKey] = useState("")
	const [gameOver, setGameOver] = useState(false)
	const [gameStart, setGameStart] = useState(false)
	const [foodPosition, setFoodPosition] = useState({
		x: getFoodLocation().x,
		y: getFoodLocation().y
	})

	const celebrationBlock = useRef<HTMLDivElement | null>(null)
	const scoreBlocks = useRef<HTMLDivElement | null>(null)

	useInterval(() => {
		gameStart && !gameOver
			? setSnakeHeadPosition((previousState: SnakePositionPropTypes) => {
					if (previousState.dir === "left")
						return snakeHeadPositionSetter(previousState, "x", -1, "left")
					if (previousState.dir === "right")
						return snakeHeadPositionSetter(previousState, "x", 1, "right")
					if (previousState.dir === "up")
						return snakeHeadPositionSetter(previousState, "y", -1, "up")
					if (previousState.dir === "down")
						return snakeHeadPositionSetter(previousState, "y", 1, "down")
			  })
			: null
	}, SNAKE_SPEED)

	useEffect(() => {
		if (!gameStart) return
		registerMovement(handleMovement, gameOver)
	}, [gameStart, gameOver])

	useEffect(() => {
		if (!gameStart) return
		SNAKE_POSITION_HISTORY.unshift(snakeHeadPosition)
		if (SNAKE_POSITION_HISTORY.length > snake.length - 1)
			SNAKE_POSITION_HISTORY.splice(snake.length - 1)
	}, [snakeHeadPosition, gameStart])

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

	const moveSnake = (key: string) => {
		if (
			key !== "ArrowRight" &&
			key !== "ArrowLeft" &&
			key !== "ArrowDown" &&
			key !== "ArrowUp" &&
			key !== "Enter"
		)
			return
		setActiveKey(key)
		if (key === "ArrowRight") {
			setSnakeHeadPosition((previousState: SnakePositionPropTypes) => {
				if (previousState.dir === "left")
					return snakeHeadPositionSetter(previousState, "x", -1, "left")
				return snakeHeadPositionSetter(previousState, "x", 1, "right")
			})
		}
		if (key === "ArrowLeft") {
			setSnakeHeadPosition((previousState: SnakePositionPropTypes) => {
				if (previousState.dir === "right")
					return snakeHeadPositionSetter(previousState, "x", 1, "right")
				return snakeHeadPositionSetter(previousState, "x", -1, "left")
			})
		}
		if (key === "ArrowDown") {
			setSnakeHeadPosition((previousState: SnakePositionPropTypes) => {
				if (previousState.dir === "up") return snakeHeadPositionSetter(previousState, "y", -1, "up")
				return snakeHeadPositionSetter(previousState, "y", 1, "down")
			})
		}
		if (key === "ArrowUp") {
			setSnakeHeadPosition((previousState: SnakePositionPropTypes) => {
				if (previousState.dir === "down")
					return snakeHeadPositionSetter(previousState, "y", 1, "down")
				return snakeHeadPositionSetter(previousState, "y", -1, "up")
			})
		}
	}

	const handleMobileButtonClick = (event: React.SyntheticEvent<EventTarget>) => {
		moveSnake((event.target as Element).className)
	}

	const gameIsOver = (reason: string) => {
		console.log(`%cCause of ded snek: ${reason}`, "color: red; font-weight: bold;")
		console.log(`Last SnakeHeadPosition: x=${snakeHeadPosition.x} / y=${snakeHeadPosition.y} / facing ${snakeHeadPosition.dir}`)
		console.log("Snake Bodyparts (without head):")
		console.log(SNAKE_POSITION_HISTORY)
		setGameOver(true)
		setSnakeHeadPosition(INITIAL_SNAKEPOSITION)
	}

	const setFoodKind = () => {
		const threshold = Math.random()
		const foodIndex = threshold > 0.9 ? 2 : threshold > 0.7 ? 1 : 0

		return setFood(FOOD_TYPES[foodIndex])
	}

	const celebrate = (scorePlus: number, highscore: string) => {
		if (!celebrationBlock.current || !scoreBlocks.current) return
		const wordEffect = scorePlus <= SCORE_PER_FOOD_TYPE[1] ? "Nom!" : "Omnom!"
		celebrationBlock.current.innerHTML = wordEffect
		celebrationBlock.current.className = "effect animate"

		highscore === "highscore"
			? Object.values(scoreBlocks.current.children).map(
					(htmlPElement: any) => (htmlPElement.className = "bling")
			  )
			: (scoreBlocks.current.children[0].className = "bling")

		setTimeout(() => {
			if (!celebrationBlock.current || !scoreBlocks.current) return
			celebrationBlock.current.className = "effect"
			Object.values(scoreBlocks.current.children).map(
				(htmlPElement: any) => (htmlPElement.className = "")
			)
		}, 500)
	}

	const foodIsEaten = () => {
		const scorePlus = SCORE_PER_FOOD_TYPE[FOOD_TYPES.indexOf(food)]
		setScore(score => score + scorePlus)
		setLevel(level => level + 1)
		if (score > highScore) {
			setHighScore(score)
			celebrate(scorePlus, "highscore")
		} else {
			celebrate(scorePlus, "")
		}

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
		gameIsOver("Out of bounds")

	if (
		!gameOver &&
		SNAKE_POSITION_HISTORY.find(
			position => position.x === snakeHeadPosition.x && position.y === snakeHeadPosition.y
		)
	)
		gameIsOver("Selfnom")

	const handleMovement = useCallback((event: any) => {
		const { key, repeat } = event
		if (repeat || key === "Enter") return

		moveSnake(key)
	}, [])

	if (gameOver) document.removeEventListener("keydown", handleMovement)

	return (
		<div className="App">
			{!gameStart && <StartScreen handleGameStart={() => setGameStart(true)} />}
			{!gameOver && gameStart && (
				<>
					<div
						className="arena"
						style={{ width: `${ARENA_SIZE_X}px`, height: `${ARENA_SIZE_Y}px` }}
					>
						<div
							className="effect"
							ref={celebrationBlock}
							style={{
								top: snakeHeadPosition.y,
								left: snakeHeadPosition.x
							}}
						></div>
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
			{gameStart && <Score scoreRef={scoreBlocks} score={score} highScore={highScore} />}
			{!gameOver && <Controls onClickHandler={handleMobileButtonClick} activeKey={activeKey} />}
		</div>
	)
}

export default App
