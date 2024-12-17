const parseInput = (content: string): number[] => {
	const lineRegex = /^([+-])\s*(\d+)$/
	return content.split('\n').map((line) => {
		const match = lineRegex.exec(line)!
		const sign = match[1] === '+' ? 1 : -1
		return sign * parseInt(match[2], 10)
	})
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	return input.reduce((acc, curr) => acc + curr, 0)
}
export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	const seen = new Set<number>()
	let frequency = 0
	let index = 0
	while (!seen.has(frequency)) {
		seen.add(frequency)
		const delta = input[index]
		index = (input.length + index + 1) % input.length
		frequency += delta
	}
	return frequency
}
