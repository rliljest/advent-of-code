// Very inefficient: if the entire line is not safe, then it tries to remove
// each item and check if that is safe. In actuality if  there is an unsafe
// gap between two numbers, then we should only check if removing either of
// those numbers fixes the issue.
const isSafe = (line: number[], allowRecurse = false): boolean => {
	const isIncreasing = line[1] > line[0]
	for (let i = 0; i < line.length - 1; i += 1) {
		const diff = (line[i + 1] - line[i]) * (isIncreasing ? 1 : -1)
		if (diff < 1 || diff > 3) {
			if (!allowRecurse) {
				return false
			}
			const nums = Array(line.length).fill(undefined).map((_, j) => j)
			return nums.some((num) => {
				const lineCopy = [...line]
				lineCopy.splice(num, 1)
				return isSafe(lineCopy)
			})
		}
	}
	return true
}

const parseInput = (input: string): number[][] => {
	return input.split('\n').map((line) => line.split(' ').map((s) => parseInt(s, 10)))
}

export const puzzle1 = (input: string): number => {
	const lines = parseInput(input)
	const safeLines = lines.filter((line) => isSafe(line))
	return safeLines.length
}

export const puzzle2 = (input: string): number => {
	const lines = parseInput(input)
	const safeLines = lines.filter((line) => isSafe(line, true))
	return safeLines.length
}
