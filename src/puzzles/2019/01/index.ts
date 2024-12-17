const parseInput = (content: string): number[] => {
	return content.split('\n').map((line) => parseInt(line, 10))
}

const fuel = (mass: number): number => {
	return Math.floor(mass / 3) - 2
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	return input.map(fuel).reduce((acc, curr) => acc + curr, 0)

}

const recursiveFuel = (mass: number): number => {
	const value = fuel(mass)
	if (value <= 0) {
		return 0
	}
	return value + recursiveFuel(value)
}

export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	return input.map(recursiveFuel).reduce((acc, curr) => acc + curr, 0)
}
