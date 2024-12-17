const parseInput = (content: string): number[] => {
	return content.split('\n').map((line) => parseInt(line, 10)).sort((l, r) => l - r)
}

export const puzzle1 = (content: string) => {
	const input = parseInput(content)
	let smallIndex = 0
	let bigIndex = input.length - 1
	while (smallIndex < bigIndex) {
		const sum = input[smallIndex] + input[bigIndex]
		if (sum === 2020) {
			return input[smallIndex] * input[bigIndex]
		} else if (sum < 2020) {
			smallIndex += 1
		} else {
			bigIndex -= 1
		}
	}
	throw new Error('Could not find answer')
}
export const puzzle2 = (content: string) => {
	const input = parseInput(content)
	for (let smallIndex = 0; smallIndex < input.length; smallIndex += 1) {
		for (let midIndex = smallIndex + 1; midIndex < input.length; midIndex += 1) {
			if (input[midIndex] + input[smallIndex] > 2020) {
				break
			}
			for (let bigIndex = midIndex + 1; bigIndex < input.length; bigIndex += 1) {
				const sum = input[midIndex] + input[smallIndex] + input[bigIndex]
				if (sum === 2020) {
					return input[midIndex] * input[smallIndex] * input[bigIndex]
				} else if (sum > 2020) {
					break
				}
			}
		}
	}
	throw new Error('Could not find answer')
}
