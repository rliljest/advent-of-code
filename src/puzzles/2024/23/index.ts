import { memoize } from '../../../utils/memo'

const parseInput = (content: string) => {
	return content.split('\n').map((line) => line.split('-') as [string, string])
}

const makeConnectedSets = (input: [string, string][]) => {
	const connections = {} as Record<string, Set<string>>

	for (const [compA, compB] of input) {
		// Add compB to compA
		const compASet = connections[compA] ?? new Set<string>()
		if (!compASet.has(compB)) {
			compASet.add(compB)
			connections[compA] = compASet
		}

		// Add compA to compB
		const compBSet = connections[compB] ?? new Set<string>()
		if (!compBSet.has(compA)) {
			compBSet.add(compA)
			connections[compB] = compBSet
		}
	}
	return connections
}

const makeFindCliquesOfSize = (connections: Record<string, Set<string>>) => memoize<[number], string[][]>((recurse, size) => {
	if (size < 3) {
		throw new Error('Invalid size')
	}
	if (size === 3) {
		const matches = new Set<string>()
		for (const compName of Object.keys(connections)) {
			// Looking for three tightly coupled computers
			for (const comp2 of connections[compName]) {
				for (const comp3 of connections[comp2]) {
					if (connections[comp3].has(compName)) {
						matches.add([compName, comp2, comp3].toSorted().join(','))
					}
				}
			}
		}
		return [...matches].toSorted().map((match) => match.split(','))
	}
	const smallerCliques = recurse(size - 1)
	// For each of these cliques, we see if we can add one of the other items
	const newCliqueSet = new Set<string>()
	for (const smallerClique of smallerCliques) {
		for (const newValue of Object.keys(connections)) {
			if (smallerClique.includes(newValue)) {
				continue
			}
			let valid = true
			for (const node of smallerClique) {
				if (!connections[node].has(newValue)) {
					valid = false
					break
				}
			}
			if (!valid) {
				continue
			}
			// This would be a valid new clique
			newCliqueSet.add([newValue, ...smallerClique].toSorted().join(','))
		}
	}
	return [...newCliqueSet].toSorted().map((match) => match.split(','))
})

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	const connections = makeConnectedSets(input)
	const findCliquesOfSize = makeFindCliquesOfSize(connections)

	const allCliqueArrays = findCliquesOfSize(3)
	const tStartCliques = allCliqueArrays.filter((cliqueArray) => cliqueArray.some((clique) => clique.startsWith('t')))
	return tStartCliques.length
}

export const puzzle2 = (content: string): string => {
	const input = parseInput(content)
	const connections = makeConnectedSets(input)
	const findCliquesOfSize = makeFindCliquesOfSize(connections)

	let i = 0
	for (i = 3; findCliquesOfSize(i).length > 1; i += 1) {
		// empty
	}
	
	const sets = findCliquesOfSize(i)
	if (sets.length !== 1) {
		throw new Error('Could not find sets')
	}
	return sets[0].join(',')
}
