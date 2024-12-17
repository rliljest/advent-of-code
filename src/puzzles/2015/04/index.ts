import crypto from 'crypto'

export const puzzle1 = (content: string): number => {
	let i = 0
	while (!crypto.createHash('md5').update(`${content}${i}`).digest('hex').startsWith('00000')) {
		i += 1
	}
	return i
}
export const puzzle2 = (content: string): number => {
	let i = 0
	while (!crypto.createHash('md5').update(`${content}${i}`).digest('hex').startsWith('000000')) {
		i += 1
	}
	return i
}
