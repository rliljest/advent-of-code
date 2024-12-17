type Direction = 'U' | 'D' | 'L' | 'R'

const parseInput = (content: string): Direction[][] => {
	return content.split('\n').map((line) => line.split('') as Direction[])
}

// [row, col]
const deltas = {
	U: [-1, 0],
	D: [+1, 0],
	L: [0, -1],
	R: [0, +1]
}

const puzzle = (keypad: string[][], input: Direction[][]): string => {
	let row = (keypad.length - 1) / 2
	let col = (keypad[0].length - 1) / 2
	const codes = [] as string[]
	for (const line of input) {
		for (const c of line) {
			const [deltaRow, deltaCol] = deltas[c]
			const [newRow, newCol] = [row + deltaRow, col + deltaCol]
			if (keypad[newRow]?.[newCol] && keypad[newRow][newCol] !== '0') {
				row = newRow
				col = newCol
			}
		}
		codes.push(keypad[row][col])
	}
	return codes.join('')
}

export const puzzle1 = (content: string): string => {
	const input = parseInput(content)
	const keypad = [
		'123'.split(''),
		'456'.split(''),
		'789'.split('')
	]
	return puzzle(keypad, input)
}

export const puzzle2 = (content: string): string => {
	const input = parseInput(content)
	const keypad = [
		'00100'.split(''),
		'02340'.split(''),
		'56789'.split(''),
		'0ABC0'.split(''),
		'00D00'.split('')
	]
	return puzzle(keypad, input)
}
