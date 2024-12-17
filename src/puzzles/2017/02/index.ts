const parseInput = (content: string): number[][] => {
	return content.split('\n').map((line) => {
		return line.split('\t').map((c) => parseInt(c, 10)).sort((l, r) => l - r)
	})
}

const sizeDifference = (values: number[]) => Math.max(...values) - Math.min(...values)

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	return input.map(sizeDifference).reduce((acc, curr) => acc + curr, 0)
}

const evenDivisible = (values: number[]) => {
	for (let smallIndex = 0; smallIndex < values.length; smallIndex += 1) {
		for (let bigIndex = smallIndex + 1; bigIndex < values.length; bigIndex += 1) {
			const big = values[bigIndex]
			const small = values[smallIndex]
			if ((big % small) === 0) {
				return big / small
			}
		}
	}
	throw new Error('Could not find divisible')
}

export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	return input.map(evenDivisible).reduce((acc, curr) => acc + curr, 0)
}
