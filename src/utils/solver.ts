const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y))

const lcm = (...arr: number[]) => {
	const _lcm = (x: number, y: number): number => (x * y) / gcd(x, y)
	return [...arr].reduce((a, b) => _lcm(a, b))
}

// Solve some equations. It's expected that initial values are all numbers
// E.g., [[1, -5]] solves one equation 1 * x - 5 = 0 and should return [5]
// [[2, 3, -32], [1, -1, -6]] solves 2x + 3y - 32 = 0, x - y - 6 = 0 and
// should return [10, 4]
export const solveSystemOfEquations = (unsortedEquations: number[][]): number[] => {
	const solveSortedSystemOfEquations = (equations: number[][]): number[] => {
		if (equations.length === 0) {
			throw new Error('Bad equations')
		} else if (equations.length === 1) {
			const eq = equations[0]
			if (eq.length !== 2) {
				throw Error(`Only one equation left, expected two vars but got ${JSON.stringify(eq)}`)
			}
			return [-1 * eq[1] / eq[0]]
		}
		// Basically we try to eliminate one variable at a time, create a new system of equations
		// and then recursively solve those
		// So we take the first variable and the first equation, and then we multiply/subtract it
		// from the others to create smaller systems of equations
		// Then we can plug in those answers and calculate the first variable again
		const eqToDelete = equations[0]

		const others = equations.slice(1)
		const reducedEquations = others.map((other) => {
			if (other[0] === 0) {
				return other.slice(1)
			}
			const multiplyLcm = lcm(eqToDelete[0], other[0])
			const firstScalar = -1 * multiplyLcm / eqToDelete[0]
			const secondScalar = multiplyLcm / other[0]
			return other.map((v, i) => {
				return (secondScalar * v) + (firstScalar * eqToDelete[i])
			}).slice(1)
		})

		const reducedSolutions = solveSortedSystemOfEquations(reducedEquations)
		const sum = reducedSolutions.map((v, i) => v * eqToDelete[i + 1]).reduce((l, r) => l + r, 0) + eqToDelete[eqToDelete.length - 1]
		const firstValue = -1 * sum / eqToDelete[0]
		const result = [firstValue, ...reducedSolutions]
		return result
	}

	// Try to sort unsortedEquations. Move zeros down to the bottom
	const sortedEquations = [...unsortedEquations]
	sortedEquations.sort((left, right) => {
		for (let i = 0; i < left.length; i += 1) {
			if ((left[i] === 0) !== (right[i] === 0)) {
				return left[i] === 0 ? 1 : -1
			}
		}
		return 0
	})

	const results = solveSortedSystemOfEquations(sortedEquations)

	return unsortedEquations.map((eq) => {
		const newIndex = sortedEquations.indexOf(eq)
		return results[newIndex]
	})
}
