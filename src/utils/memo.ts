// Remember the results from previous function calls and returns them immediately (if available)
// e.g. const fib = memoize<[number], number>((r, n) => n <= 1 ? 1 : r(n - 1) + r(n - 2))
export const memoize = <TArgs extends unknown[], TResult>(fn: (recurse: (...args: TArgs) => TResult, ...args: TArgs) => TResult, stringify?: (...args: TArgs) => string) => {
	const cache = {} as Record<string, { v: TResult }>
	const recurse = (...args: TArgs) => {
		const key = stringify ? stringify(...args) : JSON.stringify(args)
		return (cache[key] = cache[key] ?? { v: fn(recurse, ...args ) }).v
	}
	recurse.toJSON = () => Object.fromEntries(Object.entries(cache).map(([key, value]) => [key, value.v]))
	return recurse
}
