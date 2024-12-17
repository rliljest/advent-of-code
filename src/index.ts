import fs from 'fs'

import chalk from 'chalk'
import { AsciiTable3, AlignmentEnum } from 'ascii-table3'

import { puzzles } from './puzzles'

const ERROR_ANSWER = 'ERROR'

// Using date-fns, if we are in december get current year. Otherwise get previous year
const getCurrentYearAsString = () => {
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()
	return currentMonth === 11 ? String(currentYear) : String(currentYear - 1)
}

// Given a directory, find all .txt files and return their name and contents
const rawFileContents = (directoryPath: string): { fileName: string, fileContents: string }[] => {
	const result = [] as { fileName: string, fileContents: string }[]
	if (!fs.existsSync(directoryPath)) {
		return result
	}
	for (const fileName of fs.readdirSync(directoryPath)) {
		if (!fileName.endsWith('.txt')) {
			continue
		}
		const fileContents = fs.readFileSync(`${directoryPath}/${fileName}`, 'utf-8')
		result.push({
			fileName,
			fileContents: fileContents.trim()
		})
	}
	return result
}

const readFileContents = (yearString: string, dayString: string): {
	answer: string
	filename: string
	puzzlePart: 'a' | 'b'
	isDemo: boolean
	content: string
}[] => {
	const allTestFiles = rawFileContents(`./src/puzzles/${yearString}/${dayString}/tests`)
	// Key is input file name, value is raw contents
	const allInputs = Object.fromEntries(allTestFiles.filter((testFile) => !testFile.fileName.includes('answers')).map((testFile) => [testFile.fileName, testFile.fileContents] as const))
	const answerRegex = /(\w*)\s*(\d+)\s*([^\s]+)/g
	const allAnswerFiles = allTestFiles.filter((testFile) => testFile.fileName.includes('answer'))
	const allAnswerContents = allAnswerFiles.map((testFile) => testFile.fileContents).join('\n')
	const matches = allAnswerContents.matchAll(answerRegex)
	const allAnswers = [] as { fileName: string, puzzlePart: 'a' | 'b', answer: string }[]
	for (const match of matches) {
		allAnswers.push({
			fileName: match[1],
			puzzlePart: match[2] === '1' ? 'a' : 'b',
			answer: match[3]
		})
	}

	const result = [] as { answer: string, filename: string, puzzlePart: 'a' | 'b', isDemo: boolean, content: string }[]

	// We run all "input.txt" files for both part a/b, regardless of if an answer is present
	// We run "demo*.txt" files only if an answer is provided. Sometimes demo inputs are only
	// valid for one part of the test and not the other
	for (const inputKey of Object.keys(allInputs)) {
		const withoutExtension = inputKey.split('.')[0]
		const part1Answer = allAnswers.find((ans) => ans.fileName === withoutExtension && ans.puzzlePart === 'a')?.answer ?? '0'
		const part2Answer = allAnswers.find((ans) => ans.fileName === withoutExtension && ans.puzzlePart === 'b')?.answer ?? '0'
			
		if (withoutExtension === 'input') {
			result.push({
				answer: part1Answer,
				filename: withoutExtension,
				puzzlePart: 'a',
				isDemo: false,
				content: allInputs[inputKey]
			})
			if (dayString !== '25') {
				// No second part on the 25th
				result.push({
					answer: part2Answer,
					filename: withoutExtension,
					puzzlePart: 'b',
					isDemo: false,
					content: allInputs[inputKey]
				})
			}
		} else {
			if (part1Answer && part1Answer !== '0') {
				result.push({
					answer: part1Answer,
					filename: withoutExtension,
					puzzlePart: 'a',
					isDemo: true,
					content: allInputs[inputKey]
				})
			}
			if (part2Answer && part2Answer !== '0') {
				result.push({
					answer: part2Answer,
					filename: withoutExtension,
					puzzlePart: 'b',
					isDemo: true,
					content: allInputs[inputKey]
				})
			}
		}
	}

	return result.sort((left, right) => {
		if (left.filename !== right.filename) {
			if (left.filename.startsWith('input')) {
				return +1
			}
			if (right.filename.startsWith('input')) {
				return -1
			}
			return left.filename.localeCompare(right.filename)
		}
		return left.puzzlePart.charCodeAt(0) - right.puzzlePart.charCodeAt(0)
	})
}

const getPuzzles = (puzzleYearString: string, puzzleDayString: string) => {
	const puzzleYearKey = `puzzles${puzzleYearString}`
	const puzzle1Key = `puzzle1_${puzzleDayString}`
	const puzzle2Key = `puzzle2_${puzzleDayString}`

	return {
		puzzle1: puzzles[puzzleYearKey][puzzle1Key],
		puzzle2: puzzles[puzzleYearKey][puzzle2Key]
	}
}

const getDuration = (ms: number) => {
	return `${ms.toFixed(1)}ms`
}

const puzzleResultsForDay = (yearString: string, dayString: string, includeDemo: boolean, includeInput: boolean): {
	dayString: string
	fileName: string
	part: 1 | 2
	answer: string
	expectedAnswer: string
	durationInMS: number
}[] => {
	const fileContents = readFileContents(yearString, dayString).filter((option) => {
		if (!includeDemo && option.isDemo) {
			return false
		}
		return (includeInput || option.isDemo)
	})
	const { puzzle1, puzzle2 } = getPuzzles(yearString, dayString)
	const thesePuzzles = {
		a: puzzle1,
		b: puzzle2
	}
	return fileContents.map((fileContent) => {
		const puzzle = thesePuzzles[fileContent.puzzlePart]
		const puzzleStart = performance.now()
		let puzzleResult = ERROR_ANSWER as string | number
		try {
			puzzleResult = puzzle(fileContent.content, fileContent.filename)
		} catch (_e) {
			// TODO: better error handling. For now, just use -1 value to indicate
			// that there was an error
		}
		const puzzleEnd = performance.now()
		return {
			dayString,
			fileName: fileContent.filename,
			part: fileContent.puzzlePart === 'a' ? 1 : 2,
			answer: String(puzzleResult),
			expectedAnswer: String(fileContent.answer ?? 0),
			durationInMS: puzzleEnd - puzzleStart
		}
	})
}

const replaceDigitsWithQuestions = (value: string): string => {
	return value.split('').map(() => '?').join('')
}

const showPuzzleForDays = (yearString: string, dayStrings: string[], options: { includeDemo: boolean, includeInput: boolean, outputMarkdown: boolean } = { includeDemo: false, includeInput: true, outputMarkdown: false }) => {
	const puzzleResults = dayStrings.flatMap((dayString) => puzzleResultsForDay(yearString, dayString, options.includeDemo, options.includeInput))

	const tableData = puzzleResults.map((puzzleResult) => {
		let status = ' '
		if (puzzleResult.expectedAnswer && puzzleResult.expectedAnswer !== '0') {
			if (puzzleResult.expectedAnswer === puzzleResult.answer && puzzleResult.answer !== ERROR_ANSWER) {
				status = chalk.green('✓')
			} else {
				status = chalk.red('X')
			}
		}

		let value = String(puzzleResult.answer)
		if (puzzleResult.expectedAnswer && puzzleResult.expectedAnswer !== '0' && puzzleResult.expectedAnswer !== puzzleResult.answer) {
			value = `${puzzleResult.answer} != ${puzzleResult.expectedAnswer}`
		}

		return [
			status,
			`${yearString}.${puzzleResult.dayString}.${puzzleResult.part}`,
			puzzleResult.fileName,
			(puzzleResult.fileName === 'input' && options.outputMarkdown) ? replaceDigitsWithQuestions(value) : value,
			getDuration(puzzleResult.durationInMS)
		]
	})

	const title = `AoC ${yearString}`

	if (options.outputMarkdown) {
		console.log(`# ${title}`)
		console.log('')
	}

	const table = 
	new AsciiTable3(options.outputMarkdown ? undefined : title)
		.setHeading(' ', 'puzzle', 'file', 'value', 'duration')
		.setAligns([AlignmentEnum.AUTO, AlignmentEnum.RIGHT, AlignmentEnum.AUTO, AlignmentEnum.RIGHT, AlignmentEnum.RIGHT])
		.setStyle(options.outputMarkdown ? 'github-markdown' : 'unicode-mix')
		.addRowMatrix(tableData)
	console.log(table.toString())
}

// --- process

let dayStrings = [] as string[]
let yearString = getCurrentYearAsString()
let dayString = ''

const yearRegex = /(\d{4})/

if (process.argv.length > 2) {
	if (process.argv[2].match(yearRegex)) {
		yearString = process.argv[2]
		if (process.argv.length > 3) {
			dayString = process.argv[3]
		}
	} else {
		dayString = process.argv[2]
	}
}

const sortedKeys = [...Object.keys(puzzles[`puzzles${yearString}` as keyof typeof puzzles])].sort()
const biggestNumber = parseInt(sortedKeys[sortedKeys.length - 1].split('_')[1], 10)

if (dayString) {
	dayStrings = [dayString.padStart(2, '0')]
} else {
	// Just do all of the days
	dayStrings = Array(biggestNumber).fill(undefined).map((_, i) => (String(i + 1)).padStart(2, '0'))
}

showPuzzleForDays(yearString, dayStrings, { includeDemo: true, includeInput: true, outputMarkdown: false })
