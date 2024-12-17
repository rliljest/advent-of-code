import { getDistinctGroups } from '../../../utils/sets'

const hasRepeat = (str: string, n: number) => {
	const sortedLetters = str.split('').sort()
	const letterGroups = getDistinctGroups(sortedLetters, (l, r) => l === r)
	return letterGroups.some((group) => group.length === n)
}

// 60516 too high
export const puzzle1 = (content: string): number => {
	const lines = content.split('\n')

	const repeat2 = lines.filter((line) => hasRepeat(line, 2))
	const repeat3 = lines.filter((line) => hasRepeat(line, 3))

	console.log(`TWO ${JSON.stringify(repeat2, null, 2)}`)
	console.log(`THREE ${JSON.stringify(repeat2, null, 2)}`)

	return repeat2.length * repeat3.length
}

const getDifferenceString = (str1: string[], str2: string[]): string => {
	const common = [] as string[]
	let differenceCount = 0
	for (let i = 0; i < str1.length; i += 1) {
		if (str1[i] !== str2[i]) {
			if (differenceCount) {
				return ''
			}
			differenceCount += 1
		} else {
			common.push(str1[i])
		}
	}
	return common.join('')
}

export const puzzle2 = (content: string): string => {
	const options = content.split('\n').map((line) => line.split(''))
	for (let i = 0; i < options.length; i += 1) {
		for (let j = i + 1; j < options.length; j += 1) {
			const match = getDifferenceString(options[i], options[j])
			if (match) {
				return match
			}
		}
	}
	throw new Error('No solution')
}
