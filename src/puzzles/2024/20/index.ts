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

// returns [deltaRow, deltaCol, manhattanDistance]
const getAllCheatDeltas = (size: number): [number, number, number][] => {
	// All deltas that are no more than size away, as far as manhattan distance
	// is concerned. No order is guaranteed. [0, 0] is not returned
	const result = [] as [number, number, number][]
	for (let row = -1 * size; row <= size; row += 1) {
		for (let col = -1 * size; col <= size; col += 1) {
			if (row === 0 && col === 0) {
				continue
			}
			const dist = Math.abs(row) + Math.abs(col)
			if (dist <= size) {
				result.push([row, col, dist])
			}
		}
	}
	return result
}

const puzzle = (content: string, cheatDistance: number, threshold: number): number => {
	const input = parseInput(content)

	const distanceToEnd: number[][] = Array(input.map.length).fill(undefined).map(() => {
		return Array(input.map[0].length).fill(-1)
	})

	const getUntouchedNeighbors = (row: number, col: number) => {
		const neighbors = [] as { row: number, col: number }[]
		for (const delta of getAllCheatDeltas(1)) {
			if (distanceToEnd[row + delta[0]]?.[col + delta[1]] === -1 && input.map[row + delta[0]]?.[col + delta[1]] === '.') {
				neighbors.push({ row: row + delta[0], col: col + delta[1] })
			}
		}
		return neighbors
	}

    // Go through the whole map and find out (without cheating) how few steps
    // you need to get from that part of the map to the end
	const nodes = [] as { row: number, col: number }[]
	distanceToEnd[input.end.row][input.end.col] = 0
	nodes.push({ row: input.end.row, col: input.end.col })
	let node: { row: number, col: number } | undefined
	while ((node = nodes.pop())) {
		const neighbors = getUntouchedNeighbors(node.row, node.col)
		for (const neighbor of neighbors) {
			distanceToEnd[neighbor.row][neighbor.col] = 1 + distanceToEnd[node.row][node.col]
			nodes.push({ row: neighbor.row, col: neighbor.col })
		}
	}

	// We should go through the whole map and find places where a cheat would take us,
	// and then we could see if the cheat would be worth it	
	const cheatDeltas = getAllCheatDeltas(cheatDistance)
	let result = 0
	for (let row = 0; row < input.map.length; row += 1) {
		for (let col = 0; col < input.map[row].length; col += 1) {
			if (input.map[row][col] !== '.') {
				continue
			}
			const distSoFar = distanceToEnd[row][col]
			for (const cheatDelta of cheatDeltas) {
				const betterDistance = distanceToEnd[row + cheatDelta[0]]?.[col + cheatDelta[1]]
				if (typeof betterDistance === 'undefined' || betterDistance === -1) {
					// Hitting a wall or out of bounds or something
					continue
				}
				const manhattanDistance = cheatDelta[2]
				const cheatImprovement = distSoFar - (manhattanDistance + betterDistance)
			
				if (cheatImprovement >= threshold) {
					// Cheating would be worth it!
					result += 1
				}
			}
		}
	}

	return result
}

export const puzzle1 = (content: string, filename: string): number => {
	const threshold = filename.startsWith('demo') ? 10 : 100
	return puzzle(content, 2, threshold)
}

export const puzzle2 = (content: string, filename: string): number => {
	const threshold = filename.startsWith('demo') ? 50 : 100
	return puzzle(content, 20, threshold)
}
