type PuzzleRange = {
    input: number
    output: number
    length: number
}

type PuzzleMap = {
    name: string
    ranges: PuzzleRange[]
}

type PuzzleInput = {
    seeds: number[]
    maps: PuzzleMap[]
}

const parseInput = (content: string): PuzzleInput => {
	const parts = content.split('\n\n')

	const seedLine = parts[0].split(' ').slice(1) // Skip "seed :"
	const seeds = seedLine.map((s) => parseInt(s, 10))

	const mapInputs = parts.slice(1)
	const maps = mapInputs.map((mapInput) => {
		const mapParts = mapInput.split('\n')
		const mapName = mapParts[0].split(' ')[0]
		const mapRangeLines = mapParts.slice(1)
		const ranges = mapRangeLines.map((rangeLine) => {
			const rangeParts = rangeLine.split(' ')
			const input = parseInt(rangeParts[1], 10)
			const output = parseInt(rangeParts[0], 10)
			const length = parseInt(rangeParts[2], 10)
			return { input, output, length }
		})
		ranges.sort((a, b) => a.input - b.input)
		return { name: mapName, ranges }
	})
	return {
		maps,
		seeds
	}
}

const puzzleMapLookup = (puzzleMap: PuzzleMap, input: number): number => {
	const bSearch = (start = 0, end = puzzleMap.ranges.length - 1): number => {
		const mid = Math.floor((start + end) / 2)
		if (mid < 0 || mid >= puzzleMap.ranges.length) {
			return input
		}
		const midRange = puzzleMap.ranges[mid]
		if (midRange.input <= input && input < midRange.input + midRange.length) {
			// Found matching range
			return midRange.output + (input - midRange.input)
		}
		if (start >= end) {
			// No range, default to identity
			return input
		}
		if (input < midRange.input) {
			return bSearch(start, mid - 1)
		} else {
			return bSearch(mid + 1, end)
		}
	}
	return bSearch()
}

const puzzleLookup = (puzzleInput: PuzzleInput, input: number): number => {
	let result = input
	for (const puzzleMap of puzzleInput.maps) {
		result = puzzleMapLookup(puzzleMap, result)
	}
	return result
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	const locations = input.seeds.map((seed) => puzzleLookup(input, seed))
	return locations.reduce((acc, curr) => Math.min(acc, curr), Number.MAX_SAFE_INTEGER)
}
export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	return 0
}
