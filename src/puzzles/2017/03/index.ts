import { enumerateSpiral } from '../../../utils/enumerate'

export const puzzle1 = (content: string): number => {
	const input = parseInt(content, 10)
	const spiralGenerator = enumerateSpiral()
	let coords = [0, 0] as [number, number]
	for (let i = 0; i < input; i += 1) {
		const { value } = spiralGenerator.next()
		coords = value
	}
	return Math.abs(coords[0]) + Math.abs(coords[1])
}

const neighbors = [
	[-1, -1],
	[-1, 0],
	[-1, 1],
	[0, -1],
	[0, 0],
	[0, 1],
	[1, -1],
	[1, 0],
	[1, 1]
]

export const puzzle2 = (content: string): number => {
	const input = parseInt(content, 10)
	const values = {} as Record<string, number>

	const getValue = (row: number, col: number) => {
		const cached = values[`${row},${col}`]
		return cached || 0
	}
	const setValue = (row: number, col: number, value: number) => {
		values[`${row},${col}`] = value
	}

	setValue(0, 0, 1)

	for (const [row, col] of enumerateSpiral()) {
		const neighborValues = neighbors.map(([nrow, ncol]) => getValue(nrow + row, ncol + col))
		const newValue = neighborValues.reduce((acc, cur) => acc + cur, 0)
		if (newValue > input) {
			return newValue
		}
		setValue(row, col, newValue)
	}
	throw new Error('Invalid puzzle input')
}
