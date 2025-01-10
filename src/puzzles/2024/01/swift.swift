import Foundation

let inputPath = "./tests/input.txt"

let rawContents = try String(contentsOfFile: inputPath, encoding: .utf8)

struct Input {
    let left: [Int] // sorted
	let right: [Int] // sorted
    init(_ contents: String) {
		var tempLeft: [Int] = []
		var tempRight: [Int] = []
        contents.split(separator: "\n").forEach { line in
            let parts = line.split(separator: " ")
			tempLeft.append(Int(parts[0])!)
			tempRight.append(Int(parts[1])!)
        }
		self.left = tempLeft.sorted()
		self.right = tempRight.sorted()
    }
}

func part1(_ contents: String) -> Int {
    let input = Input(contents)
	return input.left.indices.reduce(0) { acc, index in
		return acc + abs(input.left[index] - input.right[index])
	}
}

func part2(_ contents: String) -> Int {
    let input = Input(contents)
	return 0
}

print("Input1 is \(part1(rawContents))")
print("Input2 is \(part2(rawContents))")