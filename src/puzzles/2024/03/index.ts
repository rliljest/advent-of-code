// Match either:
// - mul(123,456) with capture groups for the numbers
// - do()
// - don't()
const mulRegex = /(?:mul\((\d+),(\d+)\))|(?:do\(\))|(?:don't\(\))/g

const matchIsMul = (match: RegExpExecArray) => match[0].startsWith('mul')
const matchIsDo = (match: RegExpExecArray) => match[0].startsWith('do()')
const matchIsDoNot = (match: RegExpExecArray) => match[0].startsWith("don't()")

// Evaluate mul(123,456) => 123 * 456
const applyMul = (match: RegExpExecArray): number => {
	return parseInt(match[1], 10) * parseInt(match[2], 10)
}

export const puzzle1 = (input: string): number => {
	const matches = input.matchAll(mulRegex)
	return [...matches].filter(matchIsMul).map(applyMul).reduce((l, r) => l + r, 0)
}

export const puzzle2 = (input: string): number => {
	const matches = input.matchAll(mulRegex)
	let mulEnabled = true
	let result = 0
	for (const match of matches) {
		if (matchIsDo(match)) {
			mulEnabled = true
		} else if (matchIsDoNot(match)) {
			mulEnabled = false
		} else if (mulEnabled) {
			result += applyMul(match)
		}
	}
	return result
}
