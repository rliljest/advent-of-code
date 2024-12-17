import { assertNever } from '../../../utils/assert'

const up = '(' as const
const down = ')' as const

type Input = (typeof up | typeof down)[]

const parseInput = (content: string) => {
	return content.split('') as Input
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	let floor = 0
	for (const direction of input) { 
		if (direction === up) {
			floor += 1
		} else if (direction === down) {
			floor -= 1
		} else {
			assertNever(direction)
		}
	}
	return floor
}
export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	let floor = 0
	for (const [index, direction] of input.entries()) {
		floor += (direction === up) ? 1 : -1
		if (floor === -1) {
			return index + 1
		}
	}
	return 0
}
