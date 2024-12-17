/**
 * Heap that will return the smallest value first
 * @param compare - Function that returns a negative number if a &lt; b, 0 if a === b, and a positive number if a &gt; b
 * @returns Heap with push, pop, and size methods
 */
export const createHeap = <T>(compare: (a: T, b: T) => number) => {
	const heap: T[] = []

	const swap = (a: number, b: number) => {
		const temp = heap[a]
		heap[a] = heap[b]
		heap[b] = temp
	}

	const bubbleUp = (index: number) => {
		const parentIndex = Math.floor((index - 1) / 2)
		if (parentIndex > 0 && compare(heap[index], heap[parentIndex]) < 0) {
			swap(index, parentIndex)
			bubbleUp(parentIndex)
		}
	}

	const bubbleDown = (index: number) => {
		const leftChildIndex = (index * 2) + 1
		const rightChildIndex = (index * 2) + 2

		if (
			(leftChildIndex < heap.length && compare(heap[index], heap[leftChildIndex]) > 0) ||
			(rightChildIndex < heap.length && compare(heap[index], heap[rightChildIndex]) > 0)
		) {
			let swapIndex = leftChildIndex
			if (rightChildIndex < heap.length) {
				// If the right index value is less, then swap with that instead
				if (compare(heap[leftChildIndex], heap[rightChildIndex]) >= 0) {
					swapIndex = rightChildIndex
				}
			}
			swap(index, swapIndex)
			bubbleDown(swapIndex)
		}
	}

	return {
		push: (value: T) => {
			heap.push(value)
			bubbleUp(heap.length - 1)
		},
		pop: () => {
			if (heap.length === 0) {
				return undefined 
			}
			if (heap.length === 1) {
				return heap.pop() 
			}

			const value = heap[0]
			heap[0] = heap.pop()!
			bubbleDown(0)
			return value
		},
		size: () => heap.length
	}
}
