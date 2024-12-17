// https://en.wikipedia.org/wiki/Adder_(electronics)#Ripple-carry_adder

import { memoize } from '../../../utils/memo'

type Gate = {
	type: 'AND' | 'XOR' | 'OR'
	inputLeft: string
	inputRight: string
	output: string
}

type Input = {
	wireValues: Record<string, number>
	gates: Gate[]
}

const parseInput = (content: string): Input => {
	const [wireString, gatesString] = content.split('\n\n')
	const wireValues = {} as Record<string, number>

	for (const wireLine of wireString.split('\n')) {
		const [wireName, wireValueStr] = wireLine.split(': ')
		wireValues[wireName] = parseInt(wireValueStr, 10)
	}

	const gates = gatesString.split('\n').map((gateString) => {
		const parts = gateString.split(' ')
		return {
			type: parts[1] as 'AND' | 'XOR' | 'OR',
			inputLeft: parts[0],
			inputRight: parts[2],
			output: parts[4]
		}
	})
	return {
		gates,
		wireValues
	}
}
export const puzzle1 = (content: string): number => {
	const input = parseInput(content)

	const gateForOutput = {} as Record<string, Gate>

	for (const gate of input.gates) {
		if (gateForOutput[gate.output]) {
			throw new Error('Same gate multiple times')
		}
		gateForOutput[gate.output] = gate
	}

	const allWireNames = new Set([...Object.keys(input.wireValues), ...input.gates.map((gate) => gate.output)])

	const lookupWireValue = memoize<[string], number>((recurse, wire) => {
		if (typeof input.wireValues[wire] !== 'undefined') {
			return input.wireValues[wire]
		}
		const gate = gateForOutput[wire]
		if (!gate) {
			throw new Error(`Cannot find value for ${wire}`)
		}
		switch (gate.type) {
			case 'AND': {
				const leftValue = recurse(gate.inputLeft)
				if (!leftValue) {
					return 0
				}
				return recurse(gate.inputRight)
			}
			case 'OR': {
				const leftValue = recurse(gate.inputLeft)
				if (leftValue) {
					return 1
				}
				return recurse(gate.inputRight)
			}
			case 'XOR': {
				const leftValue = recurse(gate.inputLeft)
				const rightValue = recurse(gate.inputRight)
				return (leftValue !== rightValue) ? 1 : 0
			}
			default: {
				throw new Error('Invalid type')
			}
		}
	})

	const zWires = [...allWireNames].filter((wire) => wire.startsWith('z')).toSorted().toReversed()
	return parseInt(zWires.map(lookupWireValue).join(''), 2)
}

export const puzzle2 = (content: string): string => {
	const input = parseInput(content)

	const gateForOutput = {} as Record<string, Gate>

	for (const gate of input.gates) {
		if (gateForOutput[gate.output]) {
			throw new Error('Same gate multiple times')
		}
		gateForOutput[gate.output] = gate
	}

	// If the output of a gate is z, then the operation has to be XOR unless it is the last bit
	// If the output of a gate is not z and the inputs are not X, Y then it cannot be a XOR

	const lastBitName = Object.keys(gateForOutput).toSorted().findLast(() => true)!
	
	const invalidGates = [] as Gate[]

	for (const gateKey of Object.keys(gateForOutput)) {
		const gate = gateForOutput[gateKey]
		if (gate.output.startsWith('z')) {
			if (gate.type !== 'XOR' && gate.output !== lastBitName) {
				invalidGates.push(gate)
			}
		} else {
			const hasX = gate.inputLeft.startsWith('x') || gate.inputRight.startsWith('x')
			const hasY = gate.inputLeft.startsWith('y') || gate.inputRight.startsWith('y')
			if (!hasX || !hasY) {
				if (gate.type === 'XOR') {
					invalidGates.push(gate)
				}
			}
		}
	}

	// If we have an XOR gate with inputs x,y there must be another XOR gate with this gate
	// as an input
	for (const gate of input.gates) {
		const inputs = [gate.inputLeft, gate.inputRight]
		const xInputs = inputs.filter((i) => i.startsWith('x'))
		const yInputs = inputs.filter((i) => i.startsWith('y'))
		if (gate.type === 'XOR' && xInputs.length && yInputs.length && gate.output !== 'z00') {
			if (!input.gates.some((otherGate) => {
				return otherGate.type === 'XOR' && (otherGate.inputLeft === gate.output || otherGate.inputRight === gate.output)
			})) {
				invalidGates.push(gate)
			}
		}
	}

	// If we have an AND gate, there must be an OR gate with this gate as input
	for (const gate of input.gates) {
		if (gate.type === 'AND' && gate.inputLeft !== 'x00' && gate.inputRight !== 'y00') {
			if (!input.gates.some((otherGate) => {
				return otherGate.type === 'OR' && (otherGate.inputLeft === gate.output || otherGate.inputRight === gate.output)
			})) {
				invalidGates.push(gate)
			}
		}
	}

	const uniqueInvalidGates = [...(new Set(invalidGates))]
	return uniqueInvalidGates.map((g) => g.output).toSorted().join(',')
}
