// includeWords = false, "5oneight" -> [5]
// includeWords = true, "5oneight" => [5, 1, 8]
const numbersFromLine = (line: string, includeWords = false): number[] => {
	const digitNameStrings = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
	const digitStrings = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

	const allNumbers = [] as number[]
	for (let stringPosition = 0; stringPosition < line.length; stringPosition += 1) {
		let matchIndex = digitStrings.findIndex((needle) => line.startsWith(needle, stringPosition))
		if (matchIndex >= 0) {
			allNumbers.push(matchIndex)
		} else if (includeWords) {
			matchIndex = digitNameStrings.findIndex((needle) => line.startsWith(needle, stringPosition))
			if (matchIndex >= 0) {
				allNumbers.push(matchIndex)
			}
		}
	}
	return allNumbers
}

const puzzle = (lines: string[], includeWords: boolean): number => {
	// Sum up all two-digit numbers made up of the first and
	// last digits in the line,
	// "x1j3y2" => [1, 3, 2] => 12
	return lines.reduce((acc, curr) => {
		const numbers = numbersFromLine(curr, includeWords)
		if (numbers.length === 0) {
			return acc
		}
		return acc + (10 * numbers[0]) + numbers[numbers.length - 1]
	}, 0)
}

export const puzzle1 = (content: string): number => {
	return puzzle(content.split('\n'), false)
}

export const puzzle2 = (content: string): number => {
	return puzzle(content.split('\n'), true)
}
