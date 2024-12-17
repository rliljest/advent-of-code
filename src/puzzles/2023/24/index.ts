type Hailstone = {
	x: number
	y: number
	z: number
	dx: number
	dy: number
	dz: number
}

const hailRegex = /^(-?\d+),\s*(-?\d+),\s*(-?\d+)\s*@\s*(-?\d+),\s*(-?\d+),\s*(-?\d+)$/g
const readInput = (content: string): Hailstone[] => {
	return content.split('\n').map((line) => {
		const foo = line.matchAll(hailRegex)
		const [_, x, y, z, dx, dy, dz] = [...foo][0]
		return {
			x: parseInt(x, 10),
			y: parseInt(y, 10),
			z: parseInt(z, 10),
			dx: parseInt(dx, 10),
			dy: parseInt(dy, 10),
			dz: parseInt(dz, 10)
		}
	})
}

/*
  Just see if the paths traced (not stones themselves)
  will intersect. The intersection has to be in the
  search area, and in the future
  
*/
const willCrossPathsInFuture = (left: Hailstone, right: Hailstone, searchAreaMin: number, searchAreaMax: number) => {
	const leftSlope = left.dy / left.dx
	const rightSlope = right.dy / right.dx

	if (leftSlope === rightSlope) {
		// Parallel
		return false
	}

	// y = mx + b
	// m = slope
	// b is offset, b = y - (slope * x)
	const leftOffset = left.y - (leftSlope * left.x)
	const rightOffset = right.y - (rightSlope * right.x)

	// y = mx + b for both lines
	// left.y = leftSlope * left.x + leftOffset
	// right.y = rightSlope * right.x + rightOffset
	// solve left.y = right.y, left.x = right.x
	// leftSlope * left.x + leftOffset = rightSlope * right.x + rightOffset
	// leftSlope * x - rightSlope * x = rightOffset - leftOffset
	// x = (rightOffset - leftOffset) / (leftSlope - rightSlope)
	const collisionX = (rightOffset - leftOffset) / (leftSlope - rightSlope)
	// Plug x back into y = leftSlope * collisionX + leftOffset
	const collisionY = (leftSlope * collisionX) + leftOffset

	// Check if the collision point is in the future
	// Take one of the points: if the pos/neg sign of deltaX/deltaY match the
	// direction of the collision point, then we are good.
	if (((left.dx > 0) !== (collisionX - left.x > 0)) || ((right.dx > 0) !== (collisionX - right.x > 0))) {
		return false
	}

	// Check if we are in the search area
	return searchAreaMin <= collisionX && collisionX <= searchAreaMax && searchAreaMin <= collisionY && collisionY <= searchAreaMax
}

export const puzzle1 = (content: string, filename: 'demo' | 'input'): number => {
	const input = readInput(content)
	let searchAreaMin = 200000000000000
	let searchAreaMax = 400000000000000
	let collisions = 0

	if (filename === 'demo') {
		searchAreaMin = 7
		searchAreaMax = 27
	}

	for (let i = 0; i < input.length; i += 1) {
		for (let j = i + 1; j < input.length; j += 1) {
			if (willCrossPathsInFuture(input[i], input[j], searchAreaMin, searchAreaMax)) {
				collisions += 1
			}
		}
	}
	return collisions
}
export const puzzle2 = (_content: string): number => 0
