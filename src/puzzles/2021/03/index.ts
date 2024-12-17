const parseInput = (content: string): (0 | 1)[][] => {
	return content.split('\n').map((line) => {
		return line.split('').map((c) => parseInt(c, 10)) as (0 | 1)[]
	})
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)

	const gammaDigits = Array(input[0].length).fill(undefined).map((_, i) => {
		const oneCounts = input.filter((line) => line[i] === 1).length
		return oneCounts > input.length / 2 ? 1 : 0
	})

	// Could also calculate from above, too lazy to find out mask
	const epsilonDigits = Array(input[0].length).fill(undefined).map((_, i) => {
		const oneCounts = input.filter((line) => line[i] === 1).length
		return oneCounts > input.length / 2 ? 0 : 1
	})

	const gammaValue = parseInt(gammaDigits.join(''), 2)
	const epsilonValue = parseInt(epsilonDigits.join(''), 2)
	return gammaValue * epsilonValue
	
}

export const puzzle2 = (_content: string): number => 0
