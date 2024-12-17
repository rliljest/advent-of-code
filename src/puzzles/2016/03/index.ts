const unsortedInput = (content: string): [number, number, number][] => {
	const lineRegex = /^\s*(\d+)\s*(\d+)\s*(\d+)\s*$/
	return content.split('\n').map((line) => {
		const match = lineRegex.exec(line)!
		return [
			parseInt(match[1]),
			parseInt(match[2]),
			parseInt(match[3])
		] as [number, number, number]
	})
}

const parseInput = (content: string, byColumn = false): [number, number, number][] => {
	const input = unsortedInput(content)

	if (!byColumn) {
		input.forEach((line) => line.sort((l, r) => l - r))
		return input
	}

	const offsets = Array(input.length / 3).fill(undefined).map((_, i) => i)
	return offsets.flatMap((i) => {
		return [
			[input[(3 * i)][0], input[(3 * i) + 1][0], input[(3 * i) + 2][0]].sort((l, r) => l - r),
			[input[(3 * i)][1], input[(3 * i) + 1][1], input[(3 * i) + 2][1]].sort((l, r) => l - r),
			[input[(3 * i)][2], input[(3 * i) + 1][2], input[(3 * i) + 2][2]].sort((l, r) => l - r)
		] as [number, number, number][]
	})
}

const isValidTriangle = (values: [number, number, number]) => {
	return (values[0] + values[1]) > values[2]
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content, false)
	return input.filter(isValidTriangle).length
}

export const puzzle2 = (content: string): number => {
	const input = parseInput(content, true)
	return input.filter(isValidTriangle).length
}
