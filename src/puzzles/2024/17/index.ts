import { createHeap } from '../../../utils/heap'
import { getDistinctGroups } from '../../../utils/sets'

type Input = {
	A: number
	B: number
	C: number
	programs: number[]
	outputs: number[]
}

const evaluateComboOperand = (input: Input, combo: number): number => {
	if (0 <= combo && combo <= 3) {
		return combo
	}
	if (combo === 4) {
		return input.A
	} else if (combo === 5) {
		return input.B
	} else if (combo === 6) {
		return input.C
	} else {
		throw new Error(`Invalid combo number ${combo}`)
	}
}

const parseInput = (content: string): Input => {
	const input: Input = {
		A: 0,
		B: 0,
		C: 0,
		programs: [],
		outputs: []
	}

	const registerRegex = /^Register ([ABC]): (\d+)$/
	for (const line of content.split('\n')) {
		if (!line) {
			continue
		}
		const match = registerRegex.exec(line)
		if (match) {
			input[match[1] as 'A' | 'B' | 'C'] = parseInt(match[2], 10)
		} else {
			// Must be Program: 0,1,5,4,3,0
			const nums = line.split(': ')[1]
			input.programs = nums.split(',').map((c) => parseInt(c, 10))
		}
	}
	return input
}

// Returns the new instructionPointer
const stepProgram = (input: Input, instructionPointer: number): number => {
	const operand = input.programs[instructionPointer + 1]

	switch (input.programs[Number(instructionPointer)]) {
		case 0: { // adv
			input.A = Math.floor(input.A / (2 ** evaluateComboOperand(input, operand)))
			break
		}
		case 1: { // bxl
			input.B = Number(BigInt(input.B) ^ BigInt(operand))
			break
		}
		case 2: { // bst
			input.B = (evaluateComboOperand(input, operand) % 8)
			break
		}
		case 3: { // jnz
			if (input.A !== 0) {
				return operand
			}
			break
		}
		case 4: { // bxc
			input.B = Number(BigInt(input.B) ^ BigInt(input.C))
			break
		}
		case 5: { // out
			input.outputs.push(evaluateComboOperand(input, operand) % 8)
			break
		}
		case 6: { // bdv
			input.B = Math.floor(input.A / (2 ** evaluateComboOperand(input, operand)))
			break
		}
		case 7: { // cdv
			input.C = Math.floor(input.A / (2 ** evaluateComboOperand(input, operand)))
			break
		}
		default:
			throw new Error(`Invalid program ${instructionPointer}`)
	}
	return instructionPointer + 2
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)

	let instructionPointer = 0
	while (0 <= instructionPointer && instructionPointer < input.programs.length) {
		instructionPointer = stepProgram(input, instructionPointer)
	}

	return parseInt(input.outputs.join(''), 10)
}

// Break up a range into count items
// getSteps(1, 10, 3) => [1, 5, 10]
const getSteps = (lowerBound: number, upperBound: number, count: number): number[] => {
	const result = [] as number[]
	const delta = Math.floor((upperBound - lowerBound) / count)
	for (let i = 0; i < count - 1; i += 1) {
		result.push(lowerBound + (i * delta))
	}
	result.push(upperBound)
	return result
}

export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	
	// These are the absolute bounds, since they are the min/max
	// values that generate the correct number of entries
	const FIRST_WITH_ENOUGH_OUTPUT = Math.pow(2, (3 * input.programs.length) - 3) // 35184372088832 // (1n << (3n * BigInt(n) - 3n)) with n = 16 ==> Math.pow(2, 3 * 16 - 3)
	const LAST_WITH_ENOUGH_OUTPUT = Math.pow(2, (3 * (input.programs.length + 1)) - 3) - 1 // gives all 3

	// Our general plan:
	// As the initial value of A goes up, the first few output values change very
	// quickly, but the later output values only change with VERY large changes to A
	// So we will iteratively "zoom in" and take 100 samples between the current lowest
	// and highest bounds, find the range of responses that has the highest match
	// to the end of the output, and create newer bounds based on those.
	// Very similar to a binary search, but we can't use that directly since
	// changes are not strictly increasing or decreasing.
	// Also, there might be a couple different segments that we need to "zoom in" on
	//
	// Because it's not strict, we won't use it the entire time. Once we have
	// everything except the first 5 entries, then we will go through the whole range
	// to find a match since that's a searchable space

	// We want to prioritize search areas that have a higher number of matching
	// sections of the end of the program. If two search nodes have a similar
	// matching count, we want to prioritize areas with smaller lower bounds
	type SearchNode = { expectedMatch: number, lower: number, upper: number }
	const searchHeap = createHeap<SearchNode>((left, right) => {
		if (right.expectedMatch !== left.expectedMatch) {
			return right.expectedMatch - left.expectedMatch
		}
		return left.lower - right.lower
	})

	// Initialize the search space
	searchHeap.push({ expectedMatch: 0, lower: FIRST_WITH_ENOUGH_OUTPUT, upper: LAST_WITH_ENOUGH_OUTPUT })

	// Basically a brute force check of the provided search space
	// lower/upper are values for the A register. If an answer is found,
	// it is returned. Otherwise 0 is returned
	const getAnswerFromBounds = (lower: number, upper: number): number => {
		for (let regA = lower; regA <= upper; regA += 1) {
			const output = getOutput(regA)
			const match = matchEndCount(output)
			if (match === input.programs.length) {
				return regA
			}
		}
		return 0
	}

	// For a given register value, get the values that it outputs
	const getOutput = (registerA: number): number[] => {
		const inputCopy: Input = {
			A: registerA,
			B: 0,
			C: 0,
			programs: input.programs,
			outputs: []
		}
		let instructionPointer = 0
		while (0 <= instructionPointer && instructionPointer < inputCopy.programs.length) {
			instructionPointer = stepProgram(inputCopy, instructionPointer)
		}
		return inputCopy.outputs
	}

	// From the end, how many values match the expected output
	const matchEndCount = (outputs: number[]): number => {
		let result = 0
		for (let i = outputs.length - 1; i >= 0; i -= 1) {
			if (outputs[i] !== input.programs[i]) {
				return result
			}
			result += 1
		}
		return result
	}

	// When we want to "zoom in", how many samples we take to search
	const STEP_COUNT = 100

	let searchNode: SearchNode | undefined
	while ((searchNode = searchHeap.pop())) {
		const registerAValues = getSteps(searchNode.lower, searchNode.upper, STEP_COUNT)
		if (searchNode.expectedMatch >= input.programs.length - 5) {
			// We are close enough where we can just manually check
			const ans = getAnswerFromBounds(searchNode.lower, searchNode.upper)
			if (ans) {
				return ans
			}
			// Struck out, keep searching
			continue
		}
		const outputResults = registerAValues.map(getOutput)
		const matchCounts = outputResults.map(matchEndCount)
		const bestMatchCount = matchCounts.reduce((l, r) => Math.max(l, r), 0)

		// Ultimately we want to find the ranges for the sections with the
		// greatest matches. We use getDistinctGroups helper to isolate them.
		const groups = getDistinctGroups(matchCounts, (l, r) => l === r)

		let offset = 0
		for (const group of groups) {
			if (group[0] === bestMatchCount) {
				const firstIndex = Math.max(offset - 1, 0)
				const lastIndex = Math.min(offset + group.length, matchCounts.length - 1)
				const newLower = registerAValues[firstIndex]
				const newUpper = registerAValues[lastIndex]
				if (firstIndex !== 0 || lastIndex !== matchCounts.length - 1) {
					searchHeap.push({ expectedMatch: bestMatchCount, lower: newLower, upper: newUpper })
				} else {
					// We would run into an infinite loop if we added it again. It's likely that
					// we have hit a dead end in our search.
					// If we think that there should be a solution, we should try increasing
					// the value of STEP_COUNT so we have a wider search area
				}
			}
			offset += group.length
		}
	}
	throw new Error('Could not find solution')
}
