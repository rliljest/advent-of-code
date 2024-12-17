const parseInput = (content: string) => content.split('\n')

const containsThreeVowels = (letters: string[]): boolean => {
	const vowels = ['a', 'e', 'i', 'o', 'u']
	return letters.filter((l) => vowels.includes(l)).length >= 3
}

const containsDuplicate = (letters: string[]): boolean => {
	for (let i = 1; i < letters.length; i += 1) {
		if (letters[i - 1] === letters[i]) {
			return true
		}
	}
	return false
}

const doesNotContain = (word: string, badStrings: string[]): boolean => {
	return !badStrings.some((badString) => word.includes(badString))
}

const isNice1 = (word: string): boolean => {
	const letters = word.split('')
	return containsThreeVowels(letters) && containsDuplicate(letters) && doesNotContain(word, ['ab', 'cd', 'pq', 'xy'])
}

const containsDuplicatePair = (letters: string[]): boolean => {
	for (let i = 1; i < letters.length; i += 1) {
		// i - 1 and i are a pair of letters
		for (let j = i + 2; j < letters.length; j += 1) {
			if (letters[i - 1] === letters[j - 1] && letters[i] === letters[j]) {
				return true
			}
		}
	}
	return false
}

const containsRepeatWithGap = (letters: string[]): boolean => {
	for (let i = 0; i < letters.length - 2; i += 1) {
		if (letters[i] === letters[i + 2]) {
			return true
		}
	}
	return false
}

const isNice2 = (word: string): boolean => {
	const letters = word.split('')
	return containsDuplicatePair(letters) && containsRepeatWithGap(letters)
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	return input.filter(isNice1).length
}
export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	return input.filter(isNice2).length
}
