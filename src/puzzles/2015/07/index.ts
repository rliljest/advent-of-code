type SignalProvider = {
	type: 'signal'
	value: number
	destination: string
}

type AndGate = {
	type: 'and'
	left: string | number
	right: string | number
	destination: string
}

type OrGate = {
	type: 'or'
	left: string | number
	right: string | number
	destination: string
}

type LShiftGate = {
	type: 'lshift'
	source: string
	value: number
	destination: string
}

type RShiftGate = {
	type: 'rshift'
	source: string
	value: number
	destination: string
}

type NotGate = {
	type: 'not'
	source: string
	destination: string
}

type Wire = SignalProvider | AndGate | OrGate | LShiftGate | RShiftGate | NotGate

const parseInput = (content: string): Wire[] => {
	const digitsRegex = /^\d+$/
	const signalRegex = /^(\d+) -> ([a-zA-Z_]+)$/
	const andRegex = /^(\w+) AND (\w+) -> ([a-zA-Z_]+)$/
	const orRegex = /^(\w+) OR (\w+) -> ([a-zA-Z_]+)$/
	const lshiftRegex = /^([a-zA-Z_]+) LSHIFT (\d+) -> ([a-zA-Z_]+)$/
	const rshiftRegex = /^([a-zA-Z_]+) RSHIFT (\d+) -> ([a-zA-Z_]+)$/
	const notRegex = /^NOT ([a-zA-Z_]+) -> ([a-zA-Z_]+)$/
	return content.split('\n').map((line) => {
		let match: RegExpExecArray | null = null

		if ((match = signalRegex.exec(line))) {
			return {
				type: 'signal',
				value: parseInt(match[1], 10),
				destination: match[2]
			}
		} else if ((match = andRegex.exec(line))) {
			return {
				type: 'and',
				left: digitsRegex.exec(match[1]) ? parseInt(match[1], 10) : match[1],
				right: match[2],
				destination: match[3]
			}
		} else if ((match = orRegex.exec(line))) {
			return {
				type: 'or',
				left: match[1],
				right: match[2],
				destination: match[3]
			}
		} else if ((match = lshiftRegex.exec(line))) {
			return {
				type: 'lshift',
				source: match[1],
				value: parseInt(match[2], 0),
				destination: match[3]
			}
		} else if ((match = rshiftRegex.exec(line))) {
			return {
				type: 'rshift',
				source: match[1],
				value: parseInt(match[2], 0),
				destination: match[3]
			}
		} else if ((match = notRegex.exec(line))) {
			return {
				type: 'not',
				source: match[1],
				destination: match[2]
			}
		} else {
			throw new Error(`Line did not match any ${line}`)
		}
	})
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	console.log(JSON.stringify(input, null, 2))
	return 0
}
export const puzzle2 = (_content: string): number => 0
