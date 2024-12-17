type Input = string[][]

const parseInput = (content: string): Input => {
	return content.split('\n').map((line) => line.split(''))
}

// Result is array of [row, column]
const getNodes = (input: Input): Record<string, [number, number][]> => {
	const result = {} as Record<string, [number, number][]>
	for (const [rowIndex, lines] of input.entries()) {
		for (const [colIndex, maybeNode] of lines.entries()) {
			if (maybeNode === '.') {
				continue
			}
			result[maybeNode] = result[maybeNode] || []
			result[maybeNode].push([rowIndex, colIndex])
			
		}
	}
	return result
}

const nodeIsValid = (input: Input, node: readonly [number, number]): boolean => {
	const [nodeX, nodeY] = node
	if (nodeX < 0 || nodeY < 0) {
		return false
	}
	return nodeX < input.length && nodeY < input[nodeX].length
}

const getValidAntinodes = (input: Input, nodeA: [number, number], nodeB: [number, number], maxSteps = 1): [number, number][] => {
	const [nodeAX, nodeAY] = nodeA
	const [nodeBX, nodeBY] = nodeB
	if (maxSteps === 1) {
		return [
			[nodeBX + (nodeBX - nodeAX), nodeBY + (nodeBY - nodeAY)] as [number, number],
			[nodeAX + (nodeAX - nodeBX), nodeAY + (nodeAY - nodeBY)] as [number, number]
		].filter((node) => nodeIsValid(input, node))
	} else {
		const result = [] as [number, number][]
		for (let step = 0; ; step += 1) {
			const node = [nodeBX + (step * (nodeBX - nodeAX)), nodeBY + (step * (nodeBY - nodeAY))] as [number, number]
			if (nodeIsValid(input, node)) {
				result.push(node)
			} else {
				break
			}
		}
		for (let step = 0; ; step += 1) {
			const node = [nodeAX + (step * (nodeAX - nodeBX)), nodeAY + (step * (nodeAY - nodeBY))] as [number, number]
			if (nodeIsValid(input, node)) {
				result.push(node)
			} else {
				break
			}
		}
		return result
	}
}

const getAllValidAntinodes = (input: Input, nodes: [number, number][], maxSteps = 1): [number, number][] => {
	const result = [] as [number, number][]
	for (const nodeA of nodes) {
		for (const nodeB of nodes) {
			if (nodeA === nodeB) {
				continue
			}
			result.push(...getValidAntinodes(input, nodeA, nodeB, maxSteps))
		}
	}
	return result
}

const getUniqueNodes = (nodes: [number, number][]): [number, number][] => {
	const set = new Set<string>()
	for (const [x, y] of nodes) {
		set.add(`${x},${y}`)
	}
	return [...set].map((str) => {
		return str.split(',').map((x) => parseInt(x, 10)) as [number, number]
	})
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	const nodes = getNodes(input)

	const antinodes = [] as [number, number][]

	for (const nodeKey of Object.keys(nodes)) {
		const keyNodes = nodes[nodeKey]
		const keyAntinotes = getAllValidAntinodes(input, keyNodes)
		antinodes.push(...keyAntinotes)
	}
	
	const noDuplicateNodes = getUniqueNodes(antinodes)

	return noDuplicateNodes.length
}

export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	const nodes = getNodes(input)

	const antinodes = [] as [number, number][]

	for (const nodeKey of Object.keys(nodes)) {
		const keyNodes = nodes[nodeKey]
		const keyAntinotes = getAllValidAntinodes(input, keyNodes, 0)
		antinodes.push(...keyAntinotes)
	}
	
	const noDuplicateNodes = getUniqueNodes(antinodes)

	return noDuplicateNodes.length
}
