type FoodPropTypes = {
	food: string
	foodPosition: { x: number; y: number }
	snakePartSize: number
}

const Food = ({ food, foodPosition, snakePartSize }: FoodPropTypes) => (
	<div
		className={`food ${food}`}
		style={{
			top: foodPosition.y,
			left: foodPosition.x,
			width: `${snakePartSize}px`,
			height: `${snakePartSize}px`
		}}
	></div>
)

export default Food
