// Assumes that items are sorted. areSimilar will only check adjacent items
export const getDistinctGroups = <T>(items: T[], areSimilar: (left: T, right: T) => boolean): T[][] => {
	if (items.length === 0) {
		return []
	} else if (items.length === 1) {
		return [items]
	}
	const result = [] as T[][]
	let currentGroup = [items[0]]
	for (let i = 1; i < items.length; i += 1) {
		if (areSimilar(currentGroup[currentGroup.length - 1], items[i])) {
			currentGroup.push(items[i])
		} else {
			result.push(currentGroup)
			currentGroup = [items[i]]
		}
	}
	result.push(currentGroup)
	return result
}
