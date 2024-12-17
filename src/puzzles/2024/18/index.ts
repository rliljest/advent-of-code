import { aStar } from '../../../utils/astar'

type Node = [number, number]
type Input = Node[]

const parseInput = (content: string): Input => {
	return content.split('\n').map((line) => {
		return line.split(',').map((c) => parseInt(c, 10)) as Node
	})
}

// Returns shortest path from top left to bottom right
// returns null if no path could be found, otherwise returns
// [totalDistance, previousNodes]
const shortestPathLength = (fallingBytes: Input, gridSize: number): null | [number, Node[]] => {
	const deltas = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1]
	]
	// sparse array
	const data = Array<'#' | '.'>(gridSize * gridSize)

	for (const fallingByte of fallingBytes) {
		data[(gridSize * fallingByte[0]) + fallingByte[1]] = '#'
	}

	const getItemAt = (row: number, col: number): '#' | '.' => {
		if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
			return '#'
		} else {
			return data[(gridSize * row) + col] ?? '.'
		}
	}

	const startNodes = [[0, 0]] as Node[]

	const getNeighbors = (node: Node): [Node, number][] => {
		const neighbors = [] as [Node, number][]
		for (const delta of deltas) {
			const option: Node = [node[0] + delta[0], node[1] + delta[1]]
			if (getItemAt(option[0], option[1]) !== '#') {
				neighbors.push([option, 1])
			}
		}
		return neighbors
	}

	const nodeHash = (node: Node): string => {
		return node.join(',')
	} 

	const isFinalNode = (node: Node): boolean => {
		return node[0] === gridSize - 1 && node[1] === gridSize - 1
	}

	try {
		const [totalDistance, _finalNode, previousNodes] = aStar(startNodes, getNeighbors, nodeHash, isFinalNode)
		return [totalDistance, previousNodes] as [number, Node[]]
	} catch (_e) {
		return null
	}
}

export const puzzle1 = (content: string, filename: string): number => {
	const gridSize = filename === 'demo' ? 7 : 71
	const byteCount = filename === 'demo' ? 12 : 1024

	const input = parseInput(content)

	const fallingBytes = input.slice(0, byteCount)

	const result = shortestPathLength(fallingBytes, gridSize)
	return result?.[0] ?? 0
}

export const puzzle2 = (content: string, filename: string): string => {
	const gridSize = filename === 'demo' ? 7 : 71
	let byteCount = filename === 'demo' ? 12 : 1024

	const input = parseInput(content)

	const fallingBytes = input.slice(0, byteCount)

	while (true) {
		const result = shortestPathLength(fallingBytes, gridSize)
		if (!result) {
			const badByte = input[byteCount - 1]
			return `${badByte[0]},${badByte[1]}`
		}
		const [_totalDistance, previousNodes] = result
		let newByte: [number, number]
		// Keep on adding more bytes until we add one that
		// overlaps with the previous best path
		do {
			newByte = input[byteCount]
			fallingBytes.push(newByte)
			byteCount += 1
		} while (!previousNodes.some((previousNode) => previousNode[0] === newByte[0] && previousNode[1] === newByte[1]))
	}
}
