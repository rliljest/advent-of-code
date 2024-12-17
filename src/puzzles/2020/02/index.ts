type Line = { min: number, max: number, letter: string, password: string }

const parseInput = (content: string): Line[] => {
	const lineRegex = /^(\d+)-(\d+)\s+([a-z]+):\s+([a-z]+)$/
	return content.split('\n').map((line) => {
		const match = lineRegex.exec(line)!
		return {
			min: parseInt(match[1], 10),
			max: parseInt(match[2], 10),
			letter: match[3],
			password: match[4]
		}
	})
}

const isValid1 = (line: Line): boolean => {
	const lineCounts = line.password.split('').filter((c) => c === line.letter).length
	return line.min <= lineCounts && lineCounts <= line.max
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	return input.filter(isValid1).length
}

const isValid2 = (line: Line): boolean => {
	const letters = line.password.split('')
	return (letters[line.min - 1] === line.letter) !== (letters[line.max - 1] === line.letter)
}

// 451 is too high
// try 404
export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	return input.filter(isValid2).length
}
