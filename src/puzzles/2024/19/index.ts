import { memoize } from '../../../utils/memo'

type Input = {
	options: string[]
	patterns: string[]
}

const parseInput = (content: string): Input => {
	const parts = content.split('\n\n')
	return {
		options: parts[0].split(', '),
		patterns: parts[1].split('\n')
	}
}

const makePossibleCount = (input: Input) => memoize<[string], number>((recurse, pattern) => {
	if (!pattern) {
		return 1
	}
	let count = 0
	for (const option of input.options) {
		if (pattern.startsWith(option)) {
			count += recurse(pattern.substring(option.length))
		}
	}
	return count
})

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	const getPossibleCount = makePossibleCount(input)

	return input.patterns.filter(getPossibleCount).length
}

export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	const getPossibleCount = makePossibleCount(input)

	return input.patterns.map(getPossibleCount).reduce((acc, cur) => acc + cur, 0)
}
