type Input = {
	orderingRules: [number, number][]
	pageGroups: number[][]
}

const getMiddle = <T>(items: T[]): T => {
	return items[(items.length - 1) / 2]
}

const parseInput = (input: string): Input => {
	const [orderingPart, pagePart] = input.split('\n\n')
	const orderingRules = orderingPart.split('\n').map((line) => {
		return line.split('|').map((x) => parseInt(x, 10)) as [number, number]
	})
	const pageGroups = pagePart.split('\n').map((line) => {
		return line.split(',').map((x) => parseInt(x, 10))
	})
	return {
		orderingRules,
		pageGroups
	}
}

const getNumbersThatCameBefore = (input: Input): Record<number, Set<number>> => {
	const numbersThatComeBefore = {} as Record<number, Set<number>>
	for (const orderingRule of input.orderingRules) {
		let currentSet = numbersThatComeBefore[orderingRule[1]]
		if (!currentSet) {
			currentSet = new Set<number>()
			numbersThatComeBefore[orderingRule[1]] = currentSet
		}
		if (!currentSet.has(orderingRule[0])) {
			currentSet.add(orderingRule[0])
		}
	}
	return numbersThatComeBefore
}

const sortGroups = (input: Input, numbersThatComeBefore: Record<number, Set<number>>): { orderedPages: number[][], unorderedPages: number[][] } => {
	const orderedPages = [] as number[][]
	const unorderedPages = [] as number[][]
	for (const pageGroup of input.pageGroups) {
		let isOrdered = true
		for (const [index, page] of pageGroup.entries()) {
			const previousSet = numbersThatComeBefore[page]
			if (!previousSet) {
				continue
			}
			for (let otherIndex = index + 1; otherIndex < pageGroup.length; otherIndex += 1) {
				const otherPage = pageGroup[otherIndex]
				if (previousSet.has(otherPage)) {
					isOrdered = false
					unorderedPages.push(pageGroup)
					break
				}
			}
			if (!isOrdered) {
				break
			}
		}
		if (isOrdered) {
			orderedPages.push(pageGroup)
		}
	}
	return {
		orderedPages,
		unorderedPages
	}
}

export const puzzle1 = (rawInput: string): number => {
	const input = parseInput(rawInput)

	const numbersThatComeBefore = getNumbersThatCameBefore(input)

	const { orderedPages } = sortGroups(input, numbersThatComeBefore)

	return orderedPages.map(getMiddle).reduce((acc, curr) => acc + curr, 0)
}

export const puzzle2 = (rawInput: string): number => {
	const input = parseInput(rawInput)

	const numbersThatComeBefore = getNumbersThatCameBefore(input)

	const { unorderedPages } = sortGroups(input, numbersThatComeBefore)

	let result = 0
	unorderedPages.forEach((badPageGroup) => {
		badPageGroup.sort((l, r) => {
			const lSet = numbersThatComeBefore[l]
			if (lSet?.has(r)) {
				return -1
			}
			const rSet = numbersThatComeBefore[r]
			if (rSet?.has(l)) {
				return 1
			}
			return 0
		})
		result += getMiddle(badPageGroup)
	})
	return result
}
