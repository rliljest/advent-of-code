const parseInput = (content: string): Record<string, string>[] => {
	const parts = content.split('\n\n')
	return parts.map((part) => {
		const noNewlines = part.replaceAll('\n', ' ')
		const result = {} as Record<string, string>
		for (const word of noNewlines.split(' ')) {
			const [key, value] = word.split(':')
			result[key] = value
		}
		return result
	})
}

const isValid = (passport: Record<string, string>): boolean => {
	const keys = Object.keys(passport)
	if (keys.length === 8) {
		return true
	} else if (keys.length === 7 && !keys.includes('cid')) {
		return true
	}
	return false
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	return input.filter(isValid).length
}
export const puzzle2 = (_content: string): number => 0
