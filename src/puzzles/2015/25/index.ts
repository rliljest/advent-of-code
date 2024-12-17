type Input = {
	row: number
	col: number
}

const parseInput = (content: string): Input => {
	const inputRegex = /row (\d+), column (\d+)/
	const match = inputRegex.exec(content)!
	return {
		row: parseInt(match[1], 10),
		col: parseInt(match[2], 10)
	}
}

const getNextInSequence = (value: number): number => {
	return (value * 252533) % 33554393
}

const calculateSequence = (row: number, col: number): number => {
	// n * (n + 1) / 2
	// 0 => 0
	// 1 => 1
	// 2 => 3
	// 3 => 6
	// Assuming column 1, we can get the sequence with 1 + row * (row - 1) / 2

	if (col !== 1) {
		const diff = col - 1
		return diff + calculateSequence(row + diff, 1)
	} else {
		return 1 + (row * (row - 1) / 2)
	}
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	const finalSequence = calculateSequence(input.row, input.col)

	let value = 20151125
	let sequence = 1
	while (sequence < finalSequence) {
		sequence += 1
		value = getNextInSequence(value)
	}
	return value
}

export const puzzle2 = (_content: string): number => 0
