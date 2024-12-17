type Input = {
	keys: number[][]
	locks: number[][]
	maxSum: number
}

const parseInput = (content: string): Input => {
	const keys = [] as number[][]
	const locks = [] as number[][]
	let maxSum = 0

	const piper = content.split('\n\n')
	for (const segment of piper) {
		const allCharacters = segment.split('\n').map((line) => line.split(''))
		maxSum = allCharacters[0].length
		const values = Array(allCharacters[0].length).fill(0).map((_, column) => {
			// for each column, add up all '#' and subtract one
			const columnChars = allCharacters.map((line) => line[column])
			return columnChars.filter((c) => c === '#').length - 1
		})
		if (allCharacters[0][0] === '#') {
			locks.push(values)
		} else {
			keys.push(values)
		}
	}

	return {
		keys,
		locks,
		maxSum
	}
}

const keyFits = (key: number[], lock: number[], maxSize: number): boolean => {
	for (let i = 0; i < key.length; i += 1) {
		if (key[i] + lock[i] > maxSize) {
			return false
		}
	}
	return true
}

export const puzzle1 = (content: string): number => {
	let result = 0
	const input = parseInput(content)
	for (const key of input.keys) {
		for (const lock of input.locks) {
			if (keyFits(key, lock, input.maxSum)) {
				result += 1
			}
		}
	}
	return result
}
export const puzzle2 = (_content: string): number => 0
