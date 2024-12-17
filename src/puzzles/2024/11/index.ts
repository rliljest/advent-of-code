import { memoize } from '../../../utils/memo'

const parseInput = (contents: string): number[] => {
	return contents.split(' ').map((c) => parseInt(c, 10))
}

const getNextStones = (stone: number): number[] => {
	if (stone === 0) {
		return [1]
	}
	const digitCount = 1 + Math.floor(Math.log10(stone))
	if (digitCount % 2 === 0) {
		const div = Math.pow(10, digitCount / 2)
		return [Math.floor(stone / div), stone % div]
	}
	return [2024 * stone]
}

const getStoneCount = memoize<[number, number], number>((recurse, stone, blink) => {
	if (blink === 0) {
		return 1
	} else {
		return getNextStones(stone).map((nextStone) => recurse(nextStone, blink - 1)).reduce((acc, cur) => acc + cur, 0)
	}
})

export const puzzle = (numbers: number[], blink: number): number => {
	return numbers.map((n) => getStoneCount(n, blink)).reduce((acc, curr) => acc + curr, 0)
}

export const puzzle1 = (content: string): number => {
	return puzzle(parseInput(content), 25)
}

export const puzzle2 = (content: string): number => {
	return puzzle(parseInput(content), 75)
}
