const allDirections = ['U', 'R', 'D', 'L'] as const
type Direction = (typeof allDirections)[number]

type GuardPosition = {
	direction: Direction
	row: number
	col: number
}

type Board = ('.' | '#')[][]

type Input = {
	board: Board
	start: GuardPosition
}

const parseInput = (rawInput: string): Input => {
	let startRow = 0
	let startCol = 0
	const board = rawInput.split('\n').map((line) => line.split('')) as Board
	for (const [row, line] of board.entries()) {
		for (const [col, square] of line.entries()) {
			if ((square as string) === '^') {
				startRow = row
				startCol = col
				board[row][col] = '.'
				break
			}
		}
		if (startRow || startCol) {
			break
		}
	}
	return {
		board,
		start: {
			direction: 'U',
			row: startRow,
			col: startCol
		}
	}
}

const afterForward = (pos: GuardPosition): GuardPosition => {
	switch (pos.direction) {
		case 'U':
			return {
				...pos,
				row: pos.row - 1
			}
		case 'R': {
			return {
				...pos,
				col: pos.col + 1
			}
		}
		case 'D': {
			return {
				...pos,
				row: pos.row + 1
			}
		}
		case 'L': {
			return {
				...pos,
				col: pos.col - 1
			}
		}
		default:
			throw new Error('invalid pos')
	}
}

const turnRight = (direction: Direction): Direction => {
	const currentIndex = allDirections.indexOf(direction)
	return allDirections[(currentIndex + 1) % allDirections.length]
}

const advancePosition = (board: Board, pos: GuardPosition): GuardPosition => {
	const newPos = afterForward(pos)
	if (isOutOfBounds(board, newPos)) {
		return newPos
	}
	if (board[newPos.row][newPos.col] === '#') {
		// Obstacle, turn instead
		return {
			...pos,
			direction: turnRight(pos.direction)
		}
	} else {
		return newPos
	}
}

const isOutOfBounds = (board: Board, pos: GuardPosition): boolean => {
	return pos.row < 0 || pos.col < 0 || pos.row >= board.length || pos.col >= board[pos.row].length
}

const allWonderingGuardPositions = (input: Input): [number, number][] => {
	const guardPosHistory = new Set<string>()
	let guardPos = input.start
	while (!isOutOfBounds(input.board, guardPos)) {
		guardPosHistory.add(`${guardPos.row},${guardPos.col}`)
		guardPos = advancePosition(input.board, guardPos)
	}
	return [...guardPosHistory].map((value) => {
		return value.split(',').map((n) => parseInt(n, 10)) as [number, number]
	})
}

export const puzzle1 = (rawInput: string): number => {
	const input = parseInput(rawInput)
	const allPos = allWonderingGuardPositions(input)

	return allPos.length	
}

const obstacleGeneratesLoop = (input: Input, row: number, col: number): boolean => {
	if (row === input.start.row && col === input.start.col) {
		return false
	}
	// Deep copy
	const newBoard = input.board.map((line) => {
		return [...line]
	})
	newBoard[row][col] = '#'
	const guardPosHistory = new Set<string>()
	let guardPos = input.start
	while (!isOutOfBounds(newBoard, guardPos)) {
		const key = `${guardPos.row},${guardPos.col}-${guardPos.direction}`
		if (guardPosHistory.has(key)) {
			return true
		}
		guardPosHistory.add(key)
		guardPos = advancePosition(newBoard, guardPos)
	}
	return false
}

export const puzzle2 = (rawInput: string): number => {
	const input = parseInput(rawInput)
	const allPos = allWonderingGuardPositions(input)
	const validObstacles = allPos.filter(([row, col]) => obstacleGeneratesLoop(input, row, col))
	return validObstacles.length
}
