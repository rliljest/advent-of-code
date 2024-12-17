import { aStar, aStarMulti } from '../../../utils/astar'

type Input = {
	start: {
		row: number
		col: number
	}
	end: {
		row: number
		col: number
	}
	map: ('#' | '.')[][]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inputToString = (input: Input, visitedNodeHashes?: Set<string>): string => {
	return input.map.map((line, rowIndex) => {
		return line.map((c, colIndex) => {
			if (visitedNodeHashes) {
				const nodeHash = `${rowIndex},${colIndex}`
				if (visitedNodeHashes.has(nodeHash)) {
					return 'O'
				}
			}
			if (input.start.row === rowIndex && input.start.col === colIndex) {
				return 'S'
			} else if (input.end.row === rowIndex && input.end.col === colIndex) {
				return 'E'
			} else {
				return c
			}
		}).join('')
	}).join('\n')
}

const parseInput = (content: string): Input => {
	let start = { row: 0, col: 0 }
	let end = { row: 0, col: 0 }
	const map = content.split('\n').map((line, row) => {
		return line.split('').map((c, col) => {
			if (c === 'S') {
				start = { row, col }
				return '.'
			} else if (c === 'E') {
				end = { row, col }
				return '.'
			} else {
				return c as '#' | '.'
			}
		})
	})
	return {
		start,
		end,
		map
	}
}

// const NORTH = 0
const EAST = 1
// const SOUTH = 2
// const WEST = 4

const deltas = [
	[-1, 0],
	[0, 1],
	[1, 0],
	[0, -1]
] as const

type Node = {
	row: number
	col: number
	direction: number
}

const aStarArgsFromInput = (input: Input) => {
	const startNode: Node = {
		row: input.start.row,
		col: input.start.col,
		direction: EAST
	}

	const getNeighbors = (node: Node): [Node, number][] => {
		const neighbors = [] as [Node, number][]
		
		// Allow 90 degree turns
		neighbors.push([{ ...node, direction: ((node.direction + 1) % 4) }, 1000])
		neighbors.push([{ ...node, direction: ((4 + node.direction - 1) % 4) }, 1000])

		const forwardNode = {
			...node,
			row: node.row + deltas[node.direction][0],
			col: node.col + deltas[node.direction][1]
		}
		if (input.map[forwardNode.row][forwardNode.col] === '.') {
			neighbors.push([forwardNode, 1])
		}
		return neighbors
	}

	const nodeHash = (node: Node): string => {
		return `${node.row},${node.col}-${node.direction}`
	}

	const isFinalNode = (node: Node): boolean => {
		return node.col === input.end.col && node.row === input.end.row
	}

	const heuristic = (node: Node): number => {
		return Math.abs(node.row - input.end.row) + Math.abs(node.col - input.end.col)
	}
	return {
		startNode,
		getNeighbors,
		nodeHash,
		isFinalNode,
		heuristic
	}
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)

	const {
		startNode,
		getNeighbors,
		nodeHash,
		isFinalNode,
		heuristic
	} = aStarArgsFromInput(input)

	const [totalCost] = aStar([startNode], getNeighbors, nodeHash, isFinalNode, heuristic)
	return totalCost
}

export const puzzle2 = (content: string): number => {
	const input = parseInput(content)

	const {
		startNode,
		getNeighbors,
		nodeHash,
		isFinalNode
	} = aStarArgsFromInput(input)

	const results = aStarMulti([startNode], getNeighbors, nodeHash, isFinalNode)

	// Go through all of the previous nodes, make a hash of coordinates and add
	// to the set
	const locationHashes = new Set<string>()
	for (const result of results) {
		const finalNode = result[1]
		locationHashes.add(`${finalNode.row},${finalNode.col}`)
		const previousNodes = result[2]
		for (const previousNode of previousNodes) {
			locationHashes.add(`${previousNode.row},${previousNode.col}`)
		}
	}

	return locationHashes.size
}
