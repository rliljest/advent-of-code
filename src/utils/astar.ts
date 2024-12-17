import { createHeap } from './heap'

export type WithTraversalInfo<T> = {
    node: T
    heuristic: number
    totalDistance: number
    previousNodes: T[]
}

// An empty heuristic that could be used if it does not make sense to define one.
// If this is used, then the algorithm reduces to Dijkstra's Algorithm
const dummyHeuristic = <T, >(_node: T): number => 0

/**
 * Basic implementation of A* Search algorithm
 * @param startNodes - Array of nodes to start from. Must not be empty
 * @param getNeighbors - Get the neighbors of a node. Return an array of [node, distance] pairs, where distance is the cost
 * of going from the current node to the neighbor
 * @param nodeHash - Hash function to hash a node to a string
 * @param isFinalNode - Function that returns true if we are at the end node, false otherwise
 * @param heuristic - Function that guesses the total cost from a node to the goal. It *must* underestimate the actual cost,
 * otherwise the found path might not be ideal
 * @returns [totalDistance, endNode, previousNodes] where totalDistance is the total distance to the end node, endNode
 * is the end node, and previousNodes is the list of nodes that lead to the end node. Throws if no path is found
 */
export const aStar = <T>(startNodes: T[], getNeighbors: (node: T, meta: WithTraversalInfo<T>) => [T, number][], nodeHash: (node: T) => string, isFinalNode: (node: T, meta: WithTraversalInfo<T>) => boolean, heuristic = dummyHeuristic<T>) => {
	const visitedNodeHashes = new Set<string>()
	const heap = createHeap<WithTraversalInfo<T>>((l, r) => (l.totalDistance + l.heuristic) - (r.totalDistance + r.heuristic))
	
	for (const startNode of startNodes) {
		heap.push({ node: startNode, heuristic: 0, totalDistance: 0, previousNodes: [] })
		visitedNodeHashes.add(nodeHash(startNode))
	}

	let heapItem: WithTraversalInfo<T> | undefined
	while ((heapItem = heap.pop())) {
		const { node, totalDistance, previousNodes } = heapItem

		if (isFinalNode(node, heapItem)) {
			return [totalDistance, node, previousNodes] as const
		}

		for (const [neighbor, distance] of getNeighbors(node, heapItem)) {
			const neighborHash = nodeHash(neighbor)
			if (!visitedNodeHashes.has(neighborHash)) {
				heap.push({
					node: neighbor,
					heuristic: heuristic(neighbor),
					totalDistance: totalDistance + distance,
					previousNodes: [...previousNodes, node]
				})
				visitedNodeHashes.add(neighborHash)
			}
		}
	}
	throw new Error('Could not find anything')
}

// An inefficient copy of aStar that tries to gather information about _all_ optimal paths.
// Currently it just adds potential steps into a set, ideally it would return an array with
// all possible paths instead
export const aStarMulti = <T>(startNodes: T[], getNeighbors: (node: T, meta: WithTraversalInfo<T>) => [T, number][], nodeHash: (node: T) => string, isFinalNode: (node: T, meta: WithTraversalInfo<T>) => boolean, heuristic = dummyHeuristic<T>) => {
	const visitedNodeDistances = {} as Record<string, number> // new Set<string>()
	const heap = createHeap<WithTraversalInfo<T>>((l, r) => (l.totalDistance + l.heuristic) - (r.totalDistance + r.heuristic))

	for (const startNode of startNodes) {
		heap.push({ node: startNode, heuristic: 0, totalDistance: 0, previousNodes: [] })
		visitedNodeDistances[nodeHash(startNode)] = 0
	}

	const finalResults = [] as [number, T, T[]][]
	let heapItem: WithTraversalInfo<T> | undefined
	while ((heapItem = heap.pop())) {
		const { node, totalDistance, previousNodes } = heapItem

		if (isFinalNode(node, heapItem)) {
			finalResults.push([totalDistance, node, previousNodes])
		}

		for (const [neighbor, distance] of getNeighbors(node, heapItem)) {
			const neighborHash = nodeHash(neighbor)
			if (typeof visitedNodeDistances[neighborHash] === 'undefined' || visitedNodeDistances[neighborHash] === totalDistance + distance) {
				heap.push({
					node: neighbor,
					heuristic: heuristic(neighbor),
					totalDistance: totalDistance + distance,
					previousNodes: [...previousNodes, node]
				})
				visitedNodeDistances[neighborHash] = totalDistance + distance
			}
		}
	}
	if (finalResults.length === 0) {
		throw new Error('Could not find anything')
	}
	return finalResults
}
