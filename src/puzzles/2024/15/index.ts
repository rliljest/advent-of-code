const UP = '^'
const LEFT = '<'
const RIGHT = '>'
const DOWN = 'v'

const deltas = {
	[UP]: [-1, 0],
	[DOWN]: [1, 0],
	[LEFT]: [0, -1],
	[RIGHT]: [0, 1]
} as const

type Direction = keyof typeof deltas

type Input = {
	map: ('#' | 'O' | '.' | '[' | ']')[][]
	robot: {
		row: number
		col: number
	}
	instructions: Direction[]
}

const parseInput = (content: string, wide: boolean): Input => {
	const [mapStr, instructionStr] = content.split('\n\n')

	let robotRow = -1
	let robotCol = -1

	const map = mapStr.split('\n').map((line, rowIndex) => {
		if (wide) {
			return line.split('').flatMap((c, colIndex) => {
				if (c === '@') {
					robotRow = rowIndex
					robotCol = colIndex * 2
					return ['.', '.']
				} else if (c === 'O') {
					return ['[', ']']
				} else {
					return [c, c]
				}
			})
		}
		return line.split('').map((c, colIndex) => {
			if (c === '@') {
				robotRow = rowIndex
				robotCol = colIndex
				return '.'
			} else {
				return c
			}
		})
	}) as ('#' | 'O' | '.' | '[' | ']')[][]
	
	const instructions = instructionStr.split('\n').join('').split('') as Direction[]
	return {
		map,
		robot: {
			row: robotRow,
			col: robotCol
		},
		instructions
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inputToString = (input: Input): string => {
	return input.map.map((row, rowIndex) => row.map((col, colIndex) => rowIndex === input.robot.row && colIndex === input.robot.col ? '@' : col).join('')).join('\n')
}

// The below will modify input directly
const applyInstruction = (input: Input, instruction: '^' | '<' | 'v' | '>') => {
	const [deltaRow, deltaCol] = deltas[instruction]

	const [newRobotRow, newRobotCol] = [input.robot.row + deltaRow, input.robot.col + deltaCol]
	if (input.map[newRobotRow][newRobotCol] === '.') {
		// Empty space, safe to move robot
		input.robot.row = newRobotRow
		input.robot.col = newRobotCol
		return
	} else if (input.map[newRobotRow][newRobotCol] === '#') {
		// Wall
		return
	}

	// If we are going left/right, then our logic is pretty similar to before. Only
	// difference is that we cannot "teleport" one box, we have to move all of them
	if (instruction === '<' || instruction === '>') {
		let searchRow = 0
		let searchCol = 0
		for ([searchRow, searchCol] = [newRobotRow + deltaRow, newRobotCol + deltaCol]; input.map[searchRow][searchCol] === ']' || input.map[searchRow][searchCol] === '[' || input.map[searchRow][searchCol] === 'O'; [searchRow, searchCol] = [searchRow + deltaRow, searchCol + deltaCol]) {
			// Intensionally empty
		}
		if (input.map[searchRow][searchCol] === '#') {
			// Hit a wall, do nothing
			return
		}

		// It's safe for the robot to move in this direction. First, move the boxes
		// Remember we are only moving horizontally
		for (let col = searchCol; col !== newRobotCol; col += -1 * deltaCol) {
			input.map[searchRow][col] = input.map[searchRow][col - deltaCol]
		}
		// Now move rest
		input.map[newRobotRow][newRobotCol] = '.'
		input.robot = {
			row: newRobotRow,
			col: newRobotCol
		}
		return
	}

	// We are moving either up or down.
	// We need to keep track of _all_ boxes that could be affected by this move.
	// If any of them are blocked, then they are all blocked
	// Otherwise they can all move

	// We know that we are pushing up against at least one box

	// Find the row/col of the left side of all boxes
	// Returns undefined if there is a block
	const findAllAffectedBoxes = (fromRow: number, fromCol: number): undefined | [number, number, string][] => {
		const searchRow = fromRow + deltaRow
		let searchCol = fromCol + deltaCol

		if (input.map[searchRow][searchCol] === '#') {
			// Hit a wall
			return undefined
		} else if (input.map[searchRow][searchCol] === '.') {
			// Nothing here
			return []
		} else if (input.map[searchRow][searchCol] === 'O') {
			const nextMatches = findAllAffectedBoxes(searchRow, searchCol)
			if (!nextMatches) {
				// There is a wall up ahead
				return undefined
			}
			return [[searchRow, searchCol, 'O'], ...nextMatches]
		} else {
			if (input.map[searchRow][searchCol] === ']') {
				searchCol -= 1
			}
			const leftMatches = findAllAffectedBoxes(searchRow, searchCol)
			const rightMatches = findAllAffectedBoxes(searchRow, searchCol + 1)
			if (!leftMatches || !rightMatches) {
				// There is a wall up ahead
				return undefined
			}
			return [[searchRow, searchCol, input.map[searchRow][searchCol]], ...leftMatches, ...rightMatches]
		}
	}

	const findAllUniqueAffectedBoxes = (fromRow: number, fromCol: number): undefined | [number, number, string][] => {
		const boxes = findAllAffectedBoxes(fromRow, fromCol)
		if (!boxes) {
			return boxes
		}
		const boxSet = new Set<string>()
		for (const box of boxes) {
			boxSet.add(`${box[0]},${box[1]},${box[2]}`)
		}
		return [...boxSet].map((s) => {
			const [rowS, colS, boxS] = s.split(',')
			return [parseInt(rowS, 10), parseInt(colS, 10), boxS] as [number, number, string]
		})
	}

	const affectedBoxes = findAllUniqueAffectedBoxes(input.robot.row, input.robot.col)

	if (!affectedBoxes) {
		// Hit a wall, do nothing
		return
	}

	// We need to clear out all current boxes, move them in correct direction,
	// and then move the robot
	for (const [boxRow, boxCol, boxType] of affectedBoxes) {
		input.map[boxRow][boxCol] = '.'
		if (boxType !== 'O') {
			input.map[boxRow][boxCol + 1] = '.'
		}
	}
	for (const [boxRow, boxCol, boxType] of affectedBoxes) {
		if (boxType !== 'O') {
			input.map[boxRow + deltaRow][boxCol + deltaCol] = '['
			input.map[boxRow + deltaRow][boxCol + deltaCol + 1] = ']'
		} else {
			input.map[boxRow + deltaRow][boxCol + deltaCol] = 'O'
		}
	}

	input.map[input.robot.row][input.robot.col] = '.'
	input.robot = {
		row: newRobotRow,
		col: newRobotCol
	}
}

const calculateGPS = (input: Input): number => {
	let result = 0
	for (const [rowIndex, row] of input.map.entries()) {
		for (const [colIndex, col] of row.entries()) {
			if (col === 'O' || col === '[') {
				result += (100 * rowIndex) + colIndex
			}
		}
	}
	return result
}

const puzzle = (content: string, wide: boolean): number => {
	const input = parseInput(content, wide)
	for (const instruction of input.instructions) {
		applyInstruction(input, instruction)
	}
	return calculateGPS(input)
}

export const puzzle1 = (content: string): number => puzzle(content, false)

export const puzzle2 = (content: string): number => puzzle(content, true)
