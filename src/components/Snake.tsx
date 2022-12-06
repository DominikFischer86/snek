type SnakePropTypes = {
	snakeHeadDirection: string
	snakePositions: any
	snakeSize: number
	snakePart: string
	level: string
}

const Snake = ({
	snakeHeadDirection,
	snakePositions,
	snakeSize,
	snakePart,
	level
}: SnakePropTypes) => {
	return (
		<div
			className={`snek ${snakeHeadDirection} ${snakePart}`}
			style={{
				top: snakePositions[level][snakePart]?.y,
				left: snakePositions[level][snakePart]?.x,
				width: `${snakeSize}px`,
				height: `${snakeSize}px`
			}}
		></div>
	)
}

export default Snake
