import { getDistinctGroups } from '../../../utils/sets'

type Input = string[][]

const parseInput = (content: string): Input => {
	return content.split('\n').map((line) => line.split(''))
}

const deltas = [
	[-1, 0, 'LEFT'],
	[1, 0, 'RIGHT'],
	[0, 1, 'TOP'],
	[0, -1, 'BOTTOM']
] as const

type Direction = (typeof deltas)[number][2]

type EdgePiece = {
	row: number
	col: number
	direction: Direction
}

// Make sure that potentially adjacent edges are sorted next to each other
const sortEdges = (edgePieces: EdgePiece[]): EdgePiece[] => {
	return edgePieces.toSorted((left, right) => {
		if (left.direction !== right.direction) {
			return left.direction.localeCompare(right.direction)
		}
		if (['TOP', 'BOTTOM'].includes(left.direction)) {
			if (left.col !== right.col) {
				return left.col - right.col
			}
			return left.row - right.row
		} else {
			if (right.row !== left.row) {
				return left.row - right.row
			}
			return left.col - right.col
		}
	})
}

const arePartOfSameEdge = (left: EdgePiece, right: EdgePiece): boolean => {
	if (left.direction !== right.direction) {
		return false
	}
	if (['TOP', 'BOTTOM'].includes(left.direction)) {
		// Column must be the same, row different by no more than 1
		return left.col === right.col && Math.abs(left.row - right.row) <= 1
	} else {
		// Rows must be the same, col different by no more than 1
		return left.row === right.row && Math.abs(left.col - right.col) <= 1
	}
}

// If two edges are in the same direction and adjacent, they are considered to be
// part of the same edge
const uniqueEdgeCount = (edgePieces: EdgePiece[]): number => {
	return getDistinctGroups(sortEdges(edgePieces), arePartOfSameEdge).length
}

// Get all of the plots (coordinates) that are part of a particular region that contains
// whatever is at [row, col]
// Also returns edge pieces. A large square area will have many edge pieces (one for each
// unit of perimeter)
const getPlotsInRegionContaining = (input: Input, row: number, col: number): { plots: [number, number][], edgePieces: EdgePiece[] } => {
	const letterValue = input[row][col]

	// Coords as string, "row,col"
	const coordStringSet = new Set<string>()
	const edgePieces = [] as EdgePiece[]
	const addAllNeighbors = (searchRow: number, searchCol: number) => {
		const thisCoord = `${searchRow},${searchCol}`
		if (coordStringSet.has(thisCoord)) {
			return
		}
		coordStringSet.add(thisCoord)
		for (const [deltaRow, deltaCol, direction] of deltas) {
			const neighborValue = input[searchRow + deltaRow]?.[searchCol + deltaCol]
			if (neighborValue === letterValue) {
				addAllNeighbors(searchRow + deltaRow, searchCol + deltaCol)
			} else {
				edgePieces.push({ row: searchRow, col: searchCol, direction })
			}
		}
	}
	addAllNeighbors(row, col)
	return {
		plots: [...coordStringSet].map((s) => s.split(',').map((c) => parseInt(c, 10)) as [number, number]),
		edgePieces
	}
}

export const puzzle = (input: Input, applyDiscount: boolean): number => {
	let result = 0
	for (const [rowIndex, line] of input.entries()) {
		for (const [colIndex, letter] of line.entries()) {
			if (letter === '.') {
				continue
			}
			const { plots, edgePieces } = getPlotsInRegionContaining(input, rowIndex, colIndex)

			const plotArea = plots.length

			if (applyDiscount) {
				result += plotArea * uniqueEdgeCount(edgePieces)
			} else {
				result += plotArea * edgePieces.length
			}

			for (const [searchRow, searchCol] of plots) {
				// Clear out the region so we don't accidentally scan it again
				input[searchRow][searchCol] = '.'
			}
		}
	}
	return result
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	return puzzle(input, false)
}

export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	return puzzle(input, true)
}
