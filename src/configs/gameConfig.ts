export const ARENA_SIZE_X = 500
export const ARENA_SIZE_Y = 500
export const SNAKE_PART_SIZE = 20
export const SNAKE_SPEED = 100
export const RATIO_X = ARENA_SIZE_X / SNAKE_PART_SIZE
export const RATIO_Y = ARENA_SIZE_Y / SNAKE_PART_SIZE

export const FOOD_TYPES = ["egg", "chicken", "steak"]
export const SCORE_PER_FOOD_TYPE = [1, 2, 5]
export const BASE_SNAKE = ["head", "body_0", "tail"]

export const INITIAL_SNAKEPOSITION = {
	x: 0,
	y: 0,
	dir: "right"
}
export const SNAKE_POSITION_HISTORY: any[] = []
