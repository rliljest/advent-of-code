import { memoize } from '../../../utils/memo'

const _allKeypadValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A'] as const

const _allRemoteValues = ['^', 'A', '<', 'v', '>']

type RemoteValue = (typeof _allRemoteValues)[number]

const keypadDeltas = {
	'^': [-1, 0],
	'v': [1, 0],
	'<': [0, -1],
	'>': [0, 1]
} as const

const remoteValuesToMoveGenericFrom = (keypadRows: readonly (string | null)[][]) => (startValue: string, endValue: string): string[] => {	
	let startRow = 0
	let startCol = 0
	let endRow = 0
	let endCol = 0
	for (let row = 0; row < keypadRows.length; row += 1) {
		for (let col = 0; col < keypadRows[row].length; col += 1) {
			if (keypadRows[row][col] === startValue) {
				startRow = row
				startCol = col
			}
			if (keypadRows[row][col] === endValue) {
				endRow = row
				endCol = col
			}
		}
	}
	const rowDiff = endRow - startRow
	const colDiff = endCol - startCol
	
	const horizontalFirst = [] as RemoteValue[]
	const verticalFirst = [] as RemoteValue[]

	if (colDiff < 0) {
		// go left
		horizontalFirst.push(...Array(-1 * colDiff).fill('<' as const))
	}
	if (colDiff > 0) {
		// go right
		horizontalFirst.push(...Array(colDiff).fill('>' as const))
	}
	if (rowDiff < 0) {
		// go up
		horizontalFirst.push(...Array(-1 * rowDiff).fill('^' as const))
		verticalFirst.push(...Array(-1 * rowDiff).fill('^' as const))
	}
	if (rowDiff > 0) {
		// go down
		horizontalFirst.push(...Array(rowDiff).fill('v' as const))
		verticalFirst.push(...Array(rowDiff).fill('v' as const))
	}
	if (colDiff < 0) {
		// go left
		verticalFirst.push(...Array(-1 * colDiff).fill('<' as const))
	}
	if (colDiff > 0) {
		// go right
		verticalFirst.push(...Array(colDiff).fill('>' as const))
	}

	const isValid = (steps: RemoteValue[]): boolean => {
		let rowCopy = startRow
		let colCopy = startCol

		for (const step of steps) {
			const [dRow, dCol] = keypadDeltas[step as keyof typeof keypadDeltas]
			rowCopy += dRow
			colCopy += dCol
			if (!keypadRows[rowCopy][colCopy]) {
				return false
			}
		}
		return true
	}

	return [horizontalFirst, verticalFirst].filter(isValid).map((item) => item.join(''))
}

const remoteValuesToMoveKeypadFrom = remoteValuesToMoveGenericFrom([
	['7', '8', '9'],
	['4', '5', '6'],
	['1', '2', '3'],
	[null, '0', 'A']
])

const remoteValuesToMoveRemoteFrom = remoteValuesToMoveGenericFrom([
	[null, '^', 'A'],
	['<', 'v', '>']
])

const buildSequence = (passedKeys: string): string[] => {
	const buildSeq = (keys: RemoteValue[], index: number, previousKey: RemoteValue, currPath: string, result: string[]) => {
		if (index === keys.length) {
			result.push(currPath)
		} else {
			const allPaths = remoteValuesToMoveRemoteFrom(previousKey, keys[index])
			for (const path of allPaths) {
				buildSeq(keys, index + 1, keys[index], `${currPath}${path}A`, result)
			}
		}
	}
	const result = [] as string[]
	buildSeq(passedKeys.split(''), 0, 'A', '', result)
	return result
}

// Split keys up into ones that end with "A"
const getSubKeys = (keys: string): string[] => {
	if (keys.endsWith('A')) {
		// should always be the case
		const parts = keys.split('A')
		parts.pop()
		return parts.map((part) => `${part}A`)
	} else {
		return keys.split('A').map((part) => `${part}A`)
	}
}

const shortestSequence = memoize<[string, number], number>((recurse, keys, depth) => {
	if (depth === 0) {
		return keys.length
	}
	const subKeys = getSubKeys(keys)
	let total = 0
	for (const subKey of subKeys) {
		const sequences = buildSequence(subKey)
		// We have several possible sequences:
		// find the one with the smallest recursive
		// call
		total += sequences.map((sequence) => recurse(sequence, depth - 1)).reduce((acc, curr) => Math.min(acc, curr), Number.MAX_SAFE_INTEGER)
	}
	return total
})

const parseInput = (content: string) => {
	return content.split('\n')
}

const getMinimumMoves = (sequence: string, maxDepth: number): number => {
	// remoteValuesToMoveKeypadFrom
	let keypadOptions = sequence.split('').map((c, i, arr) => remoteValuesToMoveKeypadFrom(i === 0 ? 'A' : arr[i - 1], c))
	// Remove duplicates
	keypadOptions = keypadOptions.map((items) => new Set(items)).map((set) => [...set])
	
	// For each of the above possibilities, use the one with the samllest
	// shortestSequence
	const shortestOptions = keypadOptions.map((options) => {
		return options.reduce((acc, curr) => Math.min(acc, shortestSequence(curr, maxDepth)), Number.MAX_SAFE_INTEGER)
	})
	return shortestOptions.reduce((acc, curr) => acc + curr, 0)
}

const puzzleLine = (sequence: string, maxDepth: number): number => {
	const moves = getMinimumMoves(sequence, maxDepth)
	return moves * parseInt(sequence, 10)
}

const puzzle = (lines: string[], maxDepth: number): number => {
	return lines.map((linee) => puzzleLine(linee, maxDepth)).reduce((acc, curr) => acc + curr, 0)
}

export const puzzle1 = (content: string): number => {
	return puzzle(parseInput(content), 2)
}
export const puzzle2 = (content: string): number => {
	return puzzle(parseInput(content), 25)
}
