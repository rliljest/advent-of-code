const parseInput = (content: string): ('.' | '#')[][] => {
	return content.split('\n').map((line) => line.split('') as ('.' | '#')[])
}

const getTreeCount = (input: ('.' | '#')[][], deltaRow: number, deltaCol: number): number => {
	let col = 0
	let row = 0
	let treeCount = 0

	do {
		if (input[row]?.[col] === '#') {
			treeCount += 1
		}
		row += deltaRow
		col += deltaCol
		if (col >= input[row]?.length) {
			col = (col % input[row].length)
		}
	} while (row < input.length)

	return treeCount
}

export const puzzle = (content: string, options: { right: number, down: number }[]): number => {
	const input = parseInput(content)
	return options.reduce((acc, curr) => acc * getTreeCount(input, curr.down, curr.right), 1)
}

export const puzzle1 = (content: string): number => {
	return puzzle(content, [{ right: 3, down: 1 }])
}
export const puzzle2 = (content: string): number => {
	const options = [
		{ right: 1, down: 1 },
		{ right: 3, down: 1 },
		{ right: 5, down: 1 },
		{ right: 7, down: 1 },
		{ right: 1, down: 2 }
	]
	return puzzle(content, options)
}
