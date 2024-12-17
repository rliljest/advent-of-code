type Box = {
	x: number
	y: number
	z: number
}

const parseInput = (content: string): Box[] => {
	const boxRegex = /^(\d+)x(\d+)x(\d+)$/
	return content.split('\n').map((line) => {
		const match = boxRegex.exec(line)!
		return {
			x: parseInt(match[1], 10),
			y: parseInt(match[2], 10),
			z: parseInt(match[3], 10)
		}
	})
}

const wrappingPaperAmount = (box: Box): number => {
	const a = box.x * box.y
	const b = box.x * box.z
	const c = box.y * box.z
	return (2 * (a + b + c)) + Math.min(a, b, c)
}

const ribbonAmount = (box: Box): number => {
	const a = 2 * (box.x + box.y)
	const b = 2 * (box.x + box.z)
	const c = 2 * (box.y + box.z)
	return (box.x * box.y * box.z) + Math.min(a, b, c)
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	return input.map(wrappingPaperAmount).reduce((acc, curr) => acc + curr, 0)
}
export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	return input.map(ribbonAmount).reduce((acc, curr) => acc + curr, 0)
}
