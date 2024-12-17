const xmas = ['X', 'M', 'A', 'S'] as const
type Input = ((typeof xmas)[number])[][]

const parseInput = (input: string): Input => {
	return input.split('\n').map((line) => line.split('') as Input[number])
}

const xmasCount = (input: Input, row: number, col: number): number => {
	let totalCount = 0
	const deltas = [-1, 0, 1]
	for (const deltaX of deltas) {
		for (const deltaY of deltas) {
			let foundXmas = true
			if (deltaX === 0 && deltaY === 0) {
				continue
			}
			for (const [index, letter] of xmas.entries()) {
				const rowIndex = row + (index * deltaX)
				const colIndex = col + (index * deltaY)

				if (input[rowIndex]?.[colIndex] !== letter) {
					foundXmas = false
					break
				}
			}
			if (foundXmas) {
				totalCount += 1
			}
		}
	}
	return totalCount
}

const x_masCount = (input: Input, row: number, col: number): boolean => {
	if (input[row][col] !== 'A') {
		return false
	}
	const arePair = (left: string, right: string): boolean => ((left === 'M' && right === 'S') || (left === 'S' && right === 'M'))
	return arePair(input[row - 1][col - 1], input[row + 1][col + 1]) && arePair(input[row - 1][col + 1], input[row + 1][col - 1])
}

export const puzzle1 = (input: string): number => {
	// How many times can we find XMAS in the input
	const puzzle = parseInput(input)
	let totalCount = 0
	for (let row = 0; row < puzzle.length; row += 1) {
		for (let col = 0; col < puzzle[row].length; col += 1) {
			totalCount += xmasCount(puzzle, row, col)
		}
	}
	return totalCount
}
export const puzzle2 = (input: string): number => {
	// How many times can we find MAS in the shape of an X in the input
	const puzzle = parseInput(input)
	let totalCount = 0
	for (let row = 1; row < puzzle.length - 1; row += 1) {
		for (let col = 1; col < puzzle[row].length - 1; col += 1) {
			if (x_masCount(puzzle, row, col)) {
				totalCount += 1
			}
		}
	}
	return totalCount
}
