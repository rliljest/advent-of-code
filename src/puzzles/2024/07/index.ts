type Input = {
	result: number
	values: number[]
}[]

const parseInput = (content: string): Input => {
	return content.split('\n').map((line) => {
		const [resultStr, otherStr] = line.split(': ')
		return {
			result: parseInt(resultStr, 10),
			values: otherStr.split(' ').map((n) => parseInt(n, 10))
		}
	})
}

const getAllOperators = (allowConcatenation: boolean) => {
	return [
		(left: number, right: number) => left + right,
		(left: number, right: number) => left * right,
		...(allowConcatenation ? [(left: number, right: number) => parseInt(`${left}${right}`, 10)] : [])
	]
}

const canInjectOperators = (result: number, values: number[], allowConcatenation: boolean): boolean => {
	const canInject = (prefix: number, remainingValues: number[]): boolean => {
		if (remainingValues.length === 0) {
			return prefix === result
		}
		if (prefix > result) {
			return false
		}
		const remainingCopy = [...remainingValues]
		const newPrefix = remainingCopy.shift()!
		for (const operator of getAllOperators(allowConcatenation)) {
			if (canInject(operator(prefix, newPrefix), remainingCopy)) {
				return true
			}
		}
		return false
	}
    
	const startValue = values.shift()!
	return canInject(startValue, values)
}

const puzzle = (content: string, allowConcatenation: boolean): number => {
	const input = parseInput(content)
	return input.filter((line) => canInjectOperators(line.result, line.values, allowConcatenation)).map((line) => line.result).reduce((l, r) => l + r, 0)
}

export const puzzle1 = (content: string): number => {
	return puzzle(content, false)
}

export const puzzle2 = (content: string): number => {
	return puzzle(content, true)
}
