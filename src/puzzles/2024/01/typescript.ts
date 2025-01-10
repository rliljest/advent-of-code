type Line = [number, number]

const parseInput = (input: string): Line[] => {
	return input.split('\n').map((line) => line.split('   ').map((x) => parseInt(x, 10)) as [number, number])
}

// Returns [sortedLeft, sortedRight]
const sortLines = (lines: Line[]): [number[], number[]] => {
	return [
		lines.map((line) => line[0]).sort((a, b) => a - b),
		lines.map((line) => line[1]).sort((a, b) => a - b)
	] as const
}

export const puzzle1 = (input: string): number => {
	const [sortedLeft, sortedRight] = sortLines(parseInput(input))
	const differences = Array(sortedLeft.length).fill(null).map((_, i) => Math.abs(sortedLeft[i] - sortedRight[i]))
	return differences.reduce((l, r) => (l + r), 0)
}

export const puzzle2 = (input: string): number => {
	const [sortedLeft, sortedRight] = sortLines(parseInput(input))
	const rightCounts = {} as Record<string, number>
	for (const rightValue of sortedRight) {
		rightCounts[rightValue] = (rightCounts[rightValue] ?? 0) + 1
	}
    
	const similarityScores = sortedLeft.map((value) => value * (rightCounts[value] ?? 0))
	return similarityScores.reduce((l, r) => (l + r), 0)
}
