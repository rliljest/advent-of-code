type Coord = {
	x: number
	y: number
}

type Instruction = {
	type: 'turn off' | 'toggle' | 'turn on'
	start: Coord
	end: Coord
}

const parseInput = (content: string): Instruction[] => {
	const lineRegex = /^(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)$/
	return content.split('\n').map((line) => {
		const match = lineRegex.exec(line)!
		return {
			type: match[1] as 'turn off' | 'toggle' | 'turn on',
			start: {
				x: parseInt(match[2], 10),
				y: parseInt(match[3], 10)
			},
			end: {
				x: parseInt(match[4], 10),
				y: parseInt(match[5], 10)
			}
		}
	})
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	const lights = Array(1000).fill(undefined).map(() => Array(1000).fill(false)) as boolean[][]
	for (const instruction of input) {
		for (let row = instruction.start.x; row <= instruction.end.x; row += 1) {
			for (let col = instruction.start.y; col <= instruction.end.y; col += 1) {
				switch (instruction.type) {
					case 'toggle': {
						lights[row][col] = !lights[row][col]
						break
					}
					case 'turn on': {
						lights[row][col] = true
						break
					}
					case 'turn off': {
						lights[row][col] = false
						break
					}
					default:
						throw new Error('Unexpected default')
				}
			}
		}
	}
	return lights.map((row) => {
		return row.filter(Boolean).length
	}).reduce((acc, curr) => acc + curr, 0)
}
export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	const lights = Array(1000).fill(undefined).map(() => Array(1000).fill(0)) as number[][]
	for (const instruction of input) {
		for (let row = instruction.start.x; row <= instruction.end.x; row += 1) {
			for (let col = instruction.start.y; col <= instruction.end.y; col += 1) {
				switch (instruction.type) {
					case 'toggle': {
						lights[row][col] = 2 + lights[row][col]
						break
					}
					case 'turn on': {
						lights[row][col] = lights[row][col] + 1
						break
					}
					case 'turn off': {
						lights[row][col] = Math.max(0, lights[row][col] - 1)
						break
					}
					default:
						throw new Error('Unexpected default')
				}
			}
		}
	}
	return lights.map((row) => {
		return row.reduce((acc, curr) => acc + curr, 0)
	}).reduce((acc, curr) => acc + curr, 0)
}
