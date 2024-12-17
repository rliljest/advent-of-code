type Direction = 'R' | 'U' | 'L' | 'D'

type WireInput = { direction: Direction, distance: number }[]

type Input = {
	wireA: WireInput
	wireB: WireInput
}

const parseWire = (content: string): WireInput => {
	return content.split(',').map((part) => {
		const direction = part.charAt(0) as Direction
		const rest = part.slice(1)
		return {
			direction,
			distance: parseInt(rest, 10)
		}
	})
}

const parseInput = (content: string): Input => {
	const [wireA, wireB] = content.split('\n')
	return {
		wireA: parseWire(wireA),
		wireB: parseWire(wireB)
	}
}

const scales = {
	D: [1, 0],
	U: [-1, 0],
	L: [0, -1],
	R: [0, 1]
} as const

type LineSegment = {
	startOffset: number,
	direction: 'U' | 'D' | 'L' | 'R',
	start: { row: number, col: number },
	length: number
}

const getAllSegments = (wireInput: WireInput): LineSegment[] => {
	const result = [] as LineSegment[]
	let row = 0
	let col = 0
	let startOffset = 0
	for (const wire of wireInput) {
		const move = scales[wire.direction]
		const newRow = row + (move[0] * wire.distance)
		const newCol = col + (move[1] * wire.distance)

		result.push({
			start: { row, col },
			length: Math.abs(newRow - row) + Math.abs(newCol - col),
			startOffset,
			direction: wire.direction
		})
		startOffset += wire.distance
		row = newRow
		col = newCol
	}
	return result
}

type VerticalLine = {
	type: 'vert',
	col: number,
	start: number,
	length: number,
	startOffset: number,
	direction: 'U' | 'D'
}

type HorizontalLine = {
	type: 'horiz',
	row: number,
	start: number,
	length: number,
	startOffset: number,
	direction: 'L' | 'R'
}

const convertLineSegment = (line: LineSegment): VerticalLine | HorizontalLine => {
	if (line.direction === 'L' || line.direction === 'R') {
		return {
			type: 'horiz',
			row: line.start.row,
			start: line.start.col,
			length: line.length,
			startOffset: line.startOffset,
			direction: line.direction
		}
	} else {
		return {
			type: 'vert',
			col: line.start.col,
			start: line.start.row,
			length: line.length,
			startOffset: line.startOffset,
			direction: line.direction
		}
	}
}

const getAllLines = (wireInput: WireInput): { vert: VerticalLine[], horiz: HorizontalLine[] } => {
	const allLines = getAllSegments(wireInput).map(convertLineSegment)
	const vert = allLines.filter((line) => line.type === 'vert')
	const horiz = allLines.filter((line) => line.type === 'horiz')
	return {
		vert,
		horiz
	}
}

const lineIntersectsDistance = (horizontal: HorizontalLine, vertical: VerticalLine): number => {
	const horizStart = horizontal.start
	const horizEnd = horizontal.start + ((horizontal.direction === 'L' ? -1 : 1) * horizontal.length)
	const vertStart = vertical.start
	const vertEnd = vertical.start + ((vertical.direction === 'D' ? 1 : -1) * vertical.length)
	if (horizStart <= vertical.col && vertical.col <= horizEnd) {
		if (vertStart <= horizontal.row && horizontal.row <= vertEnd) {
			return Math.abs(horizontal.row) + Math.abs(vertical.col)
		}
	}
	return 0
}

const lineIntersectsCost = (horizontal: HorizontalLine, vertical: VerticalLine): number => {
	if (horizontal.start <= vertical.col && vertical.col <= horizontal.start + horizontal.length) {
		if (vertical.start <= horizontal.row && horizontal.row <= vertical.start + vertical.length) {
			return Math.abs(horizontal.row) + Math.abs(vertical.col)
		}
	}
	return 0
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	const lineA = getAllLines(input.wireA)
	const lineB = getAllLines(input.wireB)

	let bestDistance = 0
	for (const horiz of lineA.horiz) {
		for (const vert of lineB.vert) {
			const distance = lineIntersectsDistance(horiz, vert)
			if (distance && (!bestDistance || distance < bestDistance)) {
				bestDistance = distance
			}
		}
	}
	for (const horiz of lineB.horiz) {
		for (const vert of lineA.vert) {
			const distance = lineIntersectsDistance(horiz, vert)
			if (distance && (!bestDistance || distance < bestDistance)) {
				bestDistance = distance
			}
		}
	}

	return bestDistance
}
export const puzzle2 = (_content: string): number => 0
