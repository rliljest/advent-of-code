type ScratchCard = {
    cardNumber: number
    winners: number[]
    numbers: number[]
    count: number
}

const parseInput = (content: string): ScratchCard[] => {
	const lineRegex = /^Card\s+(\d+): ([\d ]+) \| ([\d ]+)$/
	return content.split('\n').map((line) => {
		const [_total, cardNumString, winningNumsString, numsString] = line.match(lineRegex)!
		const cardNumber = parseInt(cardNumString, 10)
		const winners = winningNumsString.split(' ').filter((x) => x.length > 0).map((num) => parseInt(num, 10))
		const numbers = numsString.split(' ').filter((x) => x.length > 0).map((num) => parseInt(num, 10))
		return {
			cardNumber,
			winners,
			numbers,
			count: 1
		}
	})
}

const getMatchingNumbers = (card: ScratchCard): number[] => {
	return card.numbers.filter((num) => card.winners.includes(num))
}

const getCardPoints = (card: ScratchCard): number => {
	const matching = getMatchingNumbers(card)
	if (matching.length === 0) {
		return 0
	} else {
		return 1 << (matching.length - 1)
	}
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	return input.map(getCardPoints).reduce((acc, cur) => acc + cur, 0)
}
export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	for (let i = 0; i < input.length; i++) {
		const matching = getMatchingNumbers(input[i]).length
		if (matching > 0) {
			for (let j = i + 1; j < i + 1 + matching; j++) {
				input[j].count += input[i].count
			}
		}
	}
	return input.reduce((acc, card) => acc + card.count, 0)
}
