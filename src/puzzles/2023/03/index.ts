type NumberWithLocation = {
    value: number
    lineIndex: number
    columnStart: number
    columnEndInclusive: number
}

const findNumbers = (lines: string[]) => {
	const numberRegex = /(?<num>\d+)/g
	const allNumbers: NumberWithLocation[] = []
	lines.forEach((line, lineIndex) => {
		const matches = [...line.matchAll(numberRegex)]
		if (matches) {
			for (const match of matches) {
				allNumbers.push({
					value: parseInt(match.groups!.num, 10),
					lineIndex,
					columnStart: match.index!,
					columnEndInclusive: match.index! + match.groups!.num.length - 1
				})
			}
		}
	})
	return allNumbers
}

// Find out if we are adjacent to a "part", e.g. adjacent to a symbol
const isCoordinateAdjacentToPart = (lines: string[], lineIndex: number, column: number) => {
	const line = lines[lineIndex]
	const deltaLine = [-1, 0, 1]
	const deltaColumn = [-1, 0, 1]
	for (const deltaLineValue of deltaLine) {
		for (const deltaColumnValue of deltaColumn) {
			if (deltaLineValue === 0 && deltaColumnValue === 0) {
				continue
			}
			const newLineIndex = lineIndex + deltaLineValue
			const newColumn = column + deltaColumnValue
			if (newLineIndex < 0 || newLineIndex >= lines.length) {
				continue
			}
			if (newColumn < 0 || newColumn >= line.length) {
				continue
			}
			const adjacentChar = lines[newLineIndex][newColumn]
			const notEnginePart = '0123456789.'.split('')
			if (!notEnginePart.includes(adjacentChar)) {
				return true
			}
		}
	}
	return false
}

const isNumberAdjacentToPart = (lines: string[], numberInfo: NumberWithLocation): boolean => {
	// Lot of duplication and chance for optimization: checking around each character
	// instead of once around the entire string
	for (let i = numberInfo.columnStart; i <= numberInfo.columnEndInclusive; i += 1) {
		if (isCoordinateAdjacentToPart(lines, numberInfo.lineIndex, i)) {
			return true
		}
	}
	return false
}

const isGearAdjacentToNumber = (gearInfo: {lineIndex: number, columnIndex: number}, numberInfo: NumberWithLocation): boolean => {
	// Have a 1pt buffer on all sides of number, see if gear is inside
	return numberInfo.columnStart - 1 <= gearInfo.columnIndex &&
    gearInfo.columnIndex <= numberInfo.columnEndInclusive + 1 &&
    numberInfo.lineIndex - 1 <= gearInfo.lineIndex &&
    gearInfo.lineIndex <= numberInfo.lineIndex + 1
}

const findGears = (lines: string[]) => {
	const allGears: {lineIndex: number, columnIndex: number}[] = []
	lines.forEach((line, lineIndex) => {
		const characters = line.split('')
		characters.forEach((c, columnIndex) => {
			if (c === '*') {
				allGears.push({ lineIndex, columnIndex })
			}
		})
	})
	return allGears
}

export const puzzle1 = (content: string): number => {
	const lines = content.split('\n')
	const allNumbers = findNumbers(lines)

	const numbersNotParts = allNumbers.filter((n) => isNumberAdjacentToPart(lines, n))
	return numbersNotParts.reduce((acc, curr) => acc + curr.value, 0)
}

export const puzzle2 = (content: string): number => {
	const lines = content.split('\n')
	const allNumbers = findNumbers(lines)
	const gears = findGears(lines)

	const numbersNearGears = gears.map((gear) => allNumbers.filter((numberInfo) => isGearAdjacentToNumber(gear, numberInfo)))
	const numberPairs = numbersNearGears.filter((numbers) => numbers.length === 2)

	return numberPairs.reduce((acc, curr) => {
		return acc + (curr[0].value * curr[1].value)
	}, 0)
}
