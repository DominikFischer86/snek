type SnakePropTypes = {
	snakeHeadPosition: { x: number; y: number; dir: string }
	snakeBodyPartPosition: { x: number; y: number; dir: string }[]
	snakePartSize: number
	snakePart: string
	index: number
}

const Snake = ({
	snakeHeadPosition,
	snakeBodyPartPosition,
	snakePartSize,
	snakePart,
	index
}: SnakePropTypes) => {
	const bodyPartOrientation =
		snakePart === "head" ? snakeHeadPosition.dir : snakeBodyPartPosition[index - 1]?.dir

	const noWiggle =
		snakeBodyPartPosition[snakeBodyPartPosition.length - 1]?.dir !==
		snakeBodyPartPosition[snakeBodyPartPosition.length - 2]?.dir

	return (
		<div
			className={`snek ${bodyPartOrientation} ${snakePart} ${noWiggle ? "stopWiggle" : ""}`}
			style={{
				top: snakePart === "head" ? snakeHeadPosition.y : snakeBodyPartPosition[index - 1]?.y,
				left: snakePart === "head" ? snakeHeadPosition.x : snakeBodyPartPosition[index - 1]?.x,
				width: `${snakePartSize}px`,
				height: `${snakePartSize}px`,
				backgroundColor: `hsl(${125 + index * 4}, 80%, 40%)`
			}}
		></div>
	)
}

export default Snake
