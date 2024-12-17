import { solveSystemOfEquations } from '../../../utils/solver'

type Button = {
	dx: number
	dy: number
}

type Prize = {
	x: number
	y: number
}

type MachineGame = {
	buttonA: Button
	buttonB: Button
	prize: Prize
}

type Input = MachineGame[]

const buttonRegex = /^Button [A|B]: X\+(\d+), Y\+(\d+)$/
const parseButtonLine = (buttonLine: string): Button => {
	const match = buttonRegex.exec(buttonLine)
	if (!match) {
		throw new Error(`Invalid button line ${buttonLine}`)
	}
	return {
		dx: parseInt(match[1], 10),
		dy: parseInt(match[2], 10)
	}
}

const prizeRegex = /^Prize: X=(\d+), Y=(\d+)$/
const parsePrizeLine = (prizeLine: string, prizeAdjust = 0): Prize => {
	const match = prizeRegex.exec(prizeLine)
	if (!match) {
		throw new Error(`Invalid prize line ${prizeLine}`)
	}
	return {
		x: parseInt(match[1], 10) + prizeAdjust,
		y: parseInt(match[2], 10) + prizeAdjust
	}
}

const parseInput = (content: string, prizeAdjust = 0): Input => {
	return content.split('\n\n').map((part) => {
		const [buttonALine, buttonBLine, prizeLine] = part.split('\n')
		return {
			buttonA: parseButtonLine(buttonALine),
			buttonB: parseButtonLine(buttonBLine),
			prize: parsePrizeLine(prizeLine, prizeAdjust)
		}
	})
}

// it costs 3 tokens to push the A button and 1 token to push the B button.
// Note that there should only be at most one valid solution per game
const gameCost = (game: MachineGame, pressLimit: number): number => {
	/*
		A * buttonA.dx + B * buttonB.dx - prize.x = 0
		A * buttonA.dy + B * buttonB.dy - prize.y = 0
	*/
	const solution = solveSystemOfEquations([
		[game.buttonA.dx, game.buttonB.dx, -1 * game.prize.x],
		[game.buttonA.dy, game.buttonB.dy, -1 * game.prize.y]
	])

	const buttonAPresses = Math.round(solution[0])
	const buttonBPresses = Math.round(solution[1])

	// Re-calculate where we would get with the guesses
	const finalX = (game.buttonA.dx * buttonAPresses) + (game.buttonB.dx * buttonBPresses)
	const finalY = (game.buttonA.dy * buttonAPresses) + (game.buttonB.dy * buttonBPresses)

	if (game.prize.x !== finalX || game.prize.y !== finalY) {
		// Likely non-integer answer, can't get prize
		return 0
	}
	if (pressLimit) {
		if (buttonAPresses > pressLimit || buttonBPresses > pressLimit) {
			// Too many presses required
			return 0
		}
	}
	return (3 * buttonAPresses) + buttonBPresses
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)
	return input.map((game) => gameCost(game, 100)).reduce((acc, cur) => acc + cur, 0)
}
export const puzzle2 = (content: string): number => {
	const input = parseInput(content, 10000000000000)
	return input.map((game) => gameCost(game, 0)).reduce((acc, cur) => acc + cur, 0)
}
