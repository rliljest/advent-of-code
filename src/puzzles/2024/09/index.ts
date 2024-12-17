type DiskFile = {
	type: 'file'
	size: number
	index: number
}

type DiskFree = {
	type: 'free'
	size: number
}

type DiskArea = DiskFile | DiskFree

type Input = DiskArea[]

const parseInput = (content: string): Input => {
	return content.trim().split('').map((c, i) => {
		const isFile = i % 2 === 0
		return {
			type: isFile ? 'file' : 'free',
			size: parseInt(c, 10),
			index: isFile ? i / 2 : undefined
		} as DiskArea
	})
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inputAsStr = (input: Input): string => {
	let result = ''
	for (const node of input) {
		if (node.type === 'free') {
			for (let i = 0; i < node.size; i += 1) {
				result += '.'
			}
		} else {
			for (let i = 0; i < node.size; i += 1) {
				result += String(node.index)
			}
		}
	}
	return result
}

const checksum = (input: DiskArea[]): number => {
	let finalIndex = 0
	let result = 0
	for (const node of input) {
		if (node.type === 'free') {
			finalIndex += node.size
		} else {
			// Can optimize with triangle numbers or something
			for (let i = 0; i < node.size; i += 1) {
				result += finalIndex * node.index
				finalIndex += 1
			}
		}
	}
	return result
}

export const puzzle1 = (content: string): number => {
	const input = [...parseInput(content)]
	while (true) {
		const freeIndex = input.findIndex((node) => node.type === 'free')
		const fileIndex = input.findLastIndex((node) => node.type === 'file')
		if (freeIndex === -1 || fileIndex === -1 || fileIndex <= freeIndex) {
			break
		}
		const freeNode = input[freeIndex]
		const fileNode = input[fileIndex]
		if (freeNode.size < fileNode.size) {
			// Fill free with file space
			input[freeIndex] = {
				...fileNode,
				size: freeNode.size
			}
			input[fileIndex] = {
				...fileNode,
				size: fileNode.size - freeNode.size
			}
		} else if (freeNode.size > fileNode.size) {
			// Need to split free node into multiple, change file to free
			input[freeIndex] = {
				...fileNode,
				size: fileNode.size
			}
			input[fileIndex] = {
				type: 'free',
				size: 0
			}
			// Add a new node right after freeIndex for the diff
			input.splice(freeIndex + 1, 0, {
				type: 'free',
				size: freeNode.size - fileNode.size
			})
		} else {
			// Sizes are equal, can just swap
			input[freeIndex] = fileNode
			input[fileIndex] = freeNode
		}
	}
	return checksum(input)
}

export const puzzle2 = (content: string): number => {
	const input = [...parseInput(content)]

	const lastNode = input[input.length - 1] as DiskFile
	const lastFileIndex = lastNode.index

	for (let fileIndex = lastFileIndex; fileIndex >= 0; fileIndex -= 1) {
		// TODO: Inefficient, don't need to run findIndex every time. Can have smarter pointers
		const fileNodeIndex = input.findIndex((node) => node.type === 'file' && node.index === fileIndex)
		const fileNode = input[fileNodeIndex]
		const freeIndex = input.findIndex((node, i) => node.type === 'free' && i < fileNodeIndex && node.size >= fileNode.size)
		if (freeIndex === -1) {
			continue
		}
		const freeNode = input[freeIndex]
		if (freeNode.size < fileNode.size) {
			throw new Error('invalid')
		} else if (freeNode.size > fileNode.size) {
			// Need to split free node into multiple, change file to free
			input[freeIndex] = {
				...fileNode,
				size: fileNode.size
			}
			input[fileNodeIndex] = {
				type: 'free',
				size: fileNode.size
			}
			// Add a new node right after freeIndex for the diff
			input.splice(freeIndex + 1, 0, {
				type: 'free',
				size: freeNode.size - fileNode.size
			})
		} else {
			// Sizes are equal, can just swap
			input[freeIndex] = fileNode
			input[fileNodeIndex] = freeNode
		}
	}
	
	return checksum(input)
}
