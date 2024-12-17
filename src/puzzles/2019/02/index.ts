const parseInput = (content: string) => content.split(',').map((c) => parseInt(c, 10))

const solveWithAdjustments = (content: string, noun?: number, verb?: number): number => {
	const numbers = parseInput(content)

	if (typeof noun !== 'undefined') {
		numbers[1] = noun
	}
	if (typeof verb !== 'undefined') {
		numbers[2] = verb
	}

	let index = 0
	while (0 <= index && index < numbers.length) {
		const cmd = numbers[index]
		switch (cmd) {
			case 1: {
				numbers[numbers[index + 3]] = numbers[numbers[index + 2]] + numbers[numbers[index + 1]]
				index += 4
				break
			}
			case 2: {
				numbers[numbers[index + 3]] = numbers[numbers[index + 2]] * numbers[numbers[index + 1]]
				index += 4
				break
			}
			case 99: {
				index = -1
				break
			}
			default: {
				throw new Error('Invalid command')
			}
		}
	}

	return numbers[0]
}

export const puzzle1 = (content: string, filename: string): number => {
	if (filename.startsWith('input')) {
		return solveWithAdjustments(content, 12, 2)
	} else {
		return solveWithAdjustments(content)
	}
}

export const puzzle2 = (content: string): number => {
	for (let noun = 0; noun < 100; noun += 1) {
		for (let verb = 0; verb < 100; verb += 1) {
			if (solveWithAdjustments(content, noun, verb) === 19690720) {
				return (100 * noun) + verb
			}	
		}
	}
	throw new Error('no answer found')
}
