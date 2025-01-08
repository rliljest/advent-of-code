type GameLine = {
    gameNumber: number
    rounds: Record<string, number>[]
}

// "3 blue, 4 red" => {"blue": 3, "red": 4}
const parseRound = (round: string): Record<string, number> => {
	const pulls = round.split(',').map((x) => x.trim())
	const result: Record<string, number> = {}
	for (const pull of pulls) {
		const [quantityString, color] = pull.split(' ')
		const quantity = parseInt(quantityString, 10)
		result[color] = quantity
	}
	return result
}

const parseInput = (content: string): GameLine[] => {
	return content.split('\n').map((line) => {
		const [gameNumberString, pullsString] = line.split(':')
		const gameNumber = parseInt(gameNumberString.split(' ')[1], 10)
		const roundStrings = pullsString.trim().split(';').map((x) => x.trim())
		const rounds = roundStrings.map(parseRound)
		return {
			gameNumber,
			rounds
		}
	})
}

const isPossible = (line: GameLine, shown: Record<string, number>): boolean => {
	return line.rounds.every((round) => 
		Object.keys(round).every((color) => round[color] <= (shown[color] || 0))
	)
}

const findPower = (line: GameLine): number => {
	const maxColor = (color: 'blue' | 'red' | 'green'): number => Math.max(...line.rounds.map((round) => (round[color] || 0)))
	return maxColor('blue') * maxColor('red') * maxColor('green')
}

export const puzzle1 = (content: string): number => {
	const parsedLines = parseInput(content).filter((line) => {
		return isPossible(line, {
			red: 12,
			green: 13,
			blue: 14
		})
	})
	return parsedLines.map((v) => v.gameNumber).reduce((a, b) => a + b, 0)
}

export const puzzle2 = (content: string): number => {
	const parsedLines = parseInput(content)
	const totalPower = parsedLines.map(findPower).reduce((a, b) => a + b, 0)
	return totalPower
}
