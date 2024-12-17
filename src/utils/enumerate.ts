// Enumerate all numeric combinations. Not generally useful
export function *enumerateOptions(length: number, eachOptionCount = 2): Generator<number[]> {
	if (length === 0) {
		return
	}
	const max = Math.pow(eachOptionCount, length)
	for (let i = 0; i < max; i += 1) {
		yield (i.toString(eachOptionCount).padStart(length, '0').split('').map((n) => parseInt(n, eachOptionCount)))
	}
}

export function *enumerateSpiral(): Generator<[number, number]> {
	// For now, start going to the right
	// and run counter clockwise
	// Middle (Start of spiral) has value [0, 0]
	const deltas = [
		[0, 1],
		[-1, 0],
		[0, -1],
		[1, 0]
	] as const

	let row = 0
	let col = 0
	let deltaIndex = 0
	let deltaSize = 1

	yield [0, 0]
	while (true) {
		for (let j = 0; j < 2; j++) { // Run twice for a segment length
			const [dRow, dCol] = deltas[deltaIndex]
			for (let i = 0; i < deltaSize; i += 1) {
				row += dRow
				col += dCol
				yield [row, col]
			}
			deltaIndex = (deltaIndex + 1 + deltas.length) % deltas.length
		}
		deltaSize += 1
	}
}
