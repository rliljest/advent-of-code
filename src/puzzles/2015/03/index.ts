const up = '^'
const left = '<'
const right = '>'
const down = 'v'

type Direction = typeof up | typeof left | typeof right | typeof down

const deltas = {
	[up]: [0, -1],
	[left]: [-1, 0],
	[right]: [1, 0],
	[down]: [0, 1]
}

const parseInput = (content: string): Direction[] => {
	return content.split('') as Direction[]
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	const houses = new Set<string>()

	let x = 0
	let y = 0
	houses.add(`${x},${y}`)
	for (const direction of input) {
		const delta = deltas[direction]
		x += delta[0]
		y += delta[1]
		houses.add(`${x},${y}`)
	}
	return houses.size
}
export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	const houses = new Set<string>()

	const santaDirections = input.filter((_, i) => i % 2 === 0)
	const robotDirections = input.filter((_, i) => i % 2 !== 0)

	let x = 0
	let y = 0
	houses.add(`${x},${y}`)
	for (const direction of santaDirections) {
		const delta = deltas[direction]
		x += delta[0]
		y += delta[1]
		houses.add(`${x},${y}`)
	}
	x = 0
	y = 0
	for (const direction of robotDirections) {
		const delta = deltas[direction]
		x += delta[0]
		y += delta[1]
		houses.add(`${x},${y}`)
	}
	return houses.size
}
