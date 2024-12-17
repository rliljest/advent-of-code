// #1 @ 1,3: 4x4
// # @ col,row: widthxheight

type Claim = {
    id: number
    row: number
    col: number
    width: number
    height: number
}

const parseInput = (content: string): Claim[] => {
	const claimRegex = /^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/
	return content.split('\n').map((line) => {
		const match = claimRegex.exec(line)
		if (!match) {
			throw new Error(`Invalid line ${line}`)
		}
		return {
			id: parseInt(match[1], 10),
			col: parseInt(match[2], 10),
			row: parseInt(match[3], 10),
			width: parseInt(match[4], 10),
			height: parseInt(match[5], 10)
		}
	})
}

const getOverlaps = (input: Claim[]): Record<string, number> => {
	const claimCount = {} as Record<string, number>
	for (const claim of input) {
		for (let row = claim.row; row < claim.height + claim.row; row += 1) {
			for (let col = claim.col; col < claim.width + claim.col; col += 1) {
				const key = `${row},${col}`
				claimCount[key] = (claimCount[key] ?? 0) + 1
			}
		}
	}
	return claimCount
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	const claimCount = getOverlaps(input)
	return Object.values(claimCount).filter((value) => value > 1).length
}
export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	const claimCount = getOverlaps(input)
	for (const claim of input) {
		let hasOverlap = false
		for (let row = claim.row; row < claim.height + claim.row; row += 1) {
			for (let col = claim.col; col < claim.width + claim.col; col += 1) {
				const key = `${row},${col}`
				if (claimCount[key] > 1) {
					hasOverlap = true
					break
				}
			}
			if (hasOverlap) {
				break
			}
		}
		if (!hasOverlap) {
			return claim.id
		}
	}
	throw new Error('No claim found')
}
