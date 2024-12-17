const parseInput = (content: string) => content.split('').map((c) => parseInt(c, 10))

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	return input.filter((val, i, arr) => val === arr[(arr.length + i + 1) % arr.length]).reduce((l, r) => l + r, 0)
}
export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	return input.filter((val, i, arr) => val === arr[(arr.length + i + (arr.length / 2)) % arr.length]).reduce((l, r) => l + r, 0)
}
