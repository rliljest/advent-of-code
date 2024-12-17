// North, South, East, West
const deltas = [
	[0, 1],
	[0, -1],
	[1, 0],
	[-1, 0]
]

const parseInput = (content: string): number[][] => {
	return content.split('\n').map((line) => line.split('').map((c) => parseInt(c, 10)))
}

const puzzle = (content: string, uniqueTrails: boolean): number => {
	const input = parseInput(content)

	const getTrailEnds = (row: number, col: number): string[] => {
		const value = input[row]?.[col]
		if (value === 9) {
			// At the end of the trail
			return [`${row}.${col}`]
		}
		const result = [] as string[]
		for (const [deltaRow, deltaCol] of deltas) {
			if (input[row + deltaRow]?.[col + deltaCol] === value + 1) {
				// Found the next step in the trail with value + 1
				result.push(...getTrailEnds(row + deltaRow, col + deltaCol))
			}
		}
		if (uniqueTrails) {
			return result
		} else {
			return [...(new Set(result))]
		}
	}

	let totalTrailCount = 0
	input.forEach((line, row) => {
		line.forEach((value, col) => {
			if (value === 0) {
				totalTrailCount += getTrailEnds(row, col).length
			}
		})
	})
	return totalTrailCount

}

export const puzzle1 = (content: string): number => {
	return puzzle(content, false)
}
export const puzzle2 = (content: string): number => {
	return puzzle(content, true)
}
