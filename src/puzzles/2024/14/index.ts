import { getDistinctGroups } from '../../../utils/sets'

const PUZZLE_HEIGHT = 103
const PUZZLE_WIDTH = 101

const DEMO_HEIGHT = 7
const DEMO_WIDTH = 11

type Robot = {
	px: number
	py: number
	vx: number
	vy: number
}

const parseInput = (content: string): Robot[] => {
	const robotRegex = /^p=(\d+),(\d+) v=(-?\d+),(-?\d+)$/
	return content.split('\n').map((line) => {
		const match = robotRegex.exec(line)!
		return {
			px: parseInt(match[1], 10),
			py: parseInt(match[2], 10),
			vx: parseInt(match[3], 10),
			vy: parseInt(match[4], 10)
		}
	})
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const robotsToString = (robots: Robot[], height: number, width: number): string => {
	return Array(height).fill(null).map((_yfill, y) => {
		return Array(width).fill(null).map((_xfill, x) => {
			const matchCount = robots.filter((r) => r.px === x && r.py === y).length
			if (matchCount === 0) {
				return '.'
			} else {
				return String(matchCount)
			}
		}).join('')
	}).join('\n')
}

const allQuadrants = [1, 2, 3, 4] as const

const puzzle = (robots: Robot[], height: number, width: number, seconds: number): [number, Robot[]] => {
	const finalPositionForRobot = (robot: Robot): Robot => {
		const result = {
			...robot,
			px: (robot.px + (seconds * robot.vx)) % width,
			py: (robot.py + (seconds * robot.vy)) % height
		}
		if (result.px < 0) {
			result.px = width + result.px
		}
		if (result.py < 0) {
			result.py = height + result.py
		}
		return result
	}

	const robotIsInQuadrant = (quadrant: (typeof allQuadrants)[number]) => (robot: Robot): boolean => {
		const midX = ((width - 1) / 2)
		const midY = ((height - 1) / 2)
		if (quadrant === 1 || quadrant === 3) {
			// make sure on left side
			if (robot.px >= midX) {
				return false
			}
		} else if (robot.px <= midX) {
			// make sure on right side
			return false
		}
		if (quadrant === 1 || quadrant === 2) {
			// make sure on top side
			if (robot.py >= midY) {
				return false
			}
		} else if (robot.py <= midY) {
			// make sure on bottom side
			return false
		}
		return true
	}

	const finalRobots = robots.map(finalPositionForRobot)

	return [allQuadrants.map((q) => finalRobots.filter(robotIsInQuadrant(q)).length).reduce((acc, curr) => acc * curr, 1), finalRobots]
}

export const puzzle1 = (content: string, filename: string): number => {
	const input = parseInput(content)
	if (filename === 'demo') {
		return puzzle(input, DEMO_HEIGHT, DEMO_WIDTH, 100)[0]
	} else {
		return puzzle(input, PUZZLE_HEIGHT, PUZZLE_WIDTH, 100)[0]
	}
}

const maxRobotsInLine = (robots: Robot[]): number => {
	const sortedRobots = robots.toSorted((l, r) => {
		if (l.px === r.px) {
			return r.py - l.py
		} else {
			return r.px - l.px
		}
	})
	const areRobotsAdjacent = (l: Robot, r: Robot): boolean => {
		if (l.px === r.px) {
			return Math.abs(l.py - r.py) <= 1
		} else if (l.py === r.py) {
			return Math.abs(r.px - l.px) <= 1
		} else {
			return false
		}
	}
	return getDistinctGroups(sortedRobots, areRobotsAdjacent).reduce((acc, curr) => Math.max(acc, curr.length), 0)
}

export const puzzle2 = (content: string): number => {
	const input = parseInput(content)

	let maxAdjacentRobots = 0
	let maxAdjacentSeconds = 0

	// We assume that the tree image will have a lot of robots
	// in a line, so just search for the first pattern that has
	// the most robots in a line
	for (let seconds = 0; seconds < PUZZLE_WIDTH * PUZZLE_HEIGHT; seconds += 1) {
		const [_, robots] = puzzle(input, 103, 101, seconds)
		const currentAdjacentRobots = maxRobotsInLine(robots)
		if (currentAdjacentRobots > maxAdjacentRobots) {
			maxAdjacentRobots = currentAdjacentRobots
			maxAdjacentSeconds = seconds
		}
	}

	return maxAdjacentSeconds
}
