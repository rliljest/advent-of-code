const parseInput = (content: string) => {
	return content.split('\n').map((line) => parseInt(line, 10))
}

const getNextSecretNumber = (initialSecret: number): number => {
	let secret = initialSecret

	secret = (((secret * 64) ^ secret) >>> 0) % 16777216
	secret = ((Math.floor(secret / 32) ^ secret) >>> 0) % 16777216
	secret = (((secret * 2048) ^ secret) >>> 0) % 16777216

	return secret
}

const applySecretMultipleTimes = (initialSecret: number, times: number): number => {
	let secret = initialSecret

	for (let i = 0; i < times; i += 1) {
		secret = getNextSecretNumber(secret)
	}

	return secret
}

export const puzzle1 = (content: string): number => {
	const input = parseInput(content)

	return input.map((value) => applySecretMultipleTimes(value, 2000)).reduce((l, r) => l + r, 0)
}

type PriceInfo = {secret: number, price: number, diff: number}

const getDiffSequenceFromSecret = (initialSecret: number): PriceInfo[] => {
	const result = [] as PriceInfo[]
	
	let secret = initialSecret
	result.push({ secret, price: secret % 10, diff: 0 })
	for (let i = 0; i < 2000; i += 1) {
		secret = getNextSecretNumber(secret)
		const price = secret % 10

		result.push({ secret, price, diff: price - (result[result.length - 1].price) })
	}
	return result
}

const getPriceMap = (priceInfos: PriceInfo[]): Record<string, number> => {
	const result = {} as Record<string, number>
	for (let i = 1; i < priceInfos.length - 4; i += 1) {
		const key = `${priceInfos[i].diff}${priceInfos[i + 1].diff}${priceInfos[i + 2].diff}${priceInfos[i + 3].diff}`
		if (typeof result[key] === 'undefined') {
			// We haven't seen this pattern before, so save the price
			result[key] = priceInfos[i + 3].price
		}
	}
	return result
}

export const puzzle2 = (content: string): number => {
	const input = parseInput(content)
	const allPriceInfos = input.map(getDiffSequenceFromSecret)
	const priceLookups = allPriceInfos.map(getPriceMap)
	const totalPrices: Record<string, number> = {}

	for (const priceLookup of priceLookups) {
		for (const [key, value] of Object.entries(priceLookup)) {
			totalPrices[key] = (totalPrices[key] ?? 0) + value
		}
	}

	return Object.values(totalPrices).reduce((acc, curr) => Math.max(acc, curr), 0)
}
