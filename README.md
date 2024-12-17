# Advent of Code Solutions

This hosts my solutions to the [2024 Advent of Code](https://adventofcode.com/2024) challenge. None of these are meant to be optimal solutions: generally I try to make the solutions readable, and if they can come up with a correct solution in a couple of seconds then that's good enough for me.

## Running the Solutions

To run the solutions, you need to be using Node 23.1.0 on your system. Then install dependencies with:

```
npm ci
```

Note that the dependencies are only for executing the runner (checking for correct answers, putting the results in a table format, etc.). The actual solutions themselves are written in pure TypeScript. Occasionally there might be shared code from the [utils](./src/utils) directory.

To run the solutions for _all_ days of the "current" testing year, run `npm run test`. You can also specify a specific day, e.g. `npm run test -- 5`

|   |  puzzle   | file  | value | duration |
|---|-----------|-------|-------|----------|
| ✓ | 2024.05.1 | demo  |   143 |    0.3ms |
| ✓ | 2024.05.2 | demo  |   123 |    0.1ms |
| ✓ | 2024.05.1 | input |  6260 |    1.6ms |
| ✓ | 2024.05.2 | input |  5346 |    1.2ms |

## Test Files

Each day as a `tests` directory, which includes input and answer files. The creator of AoC does not want full inputs to be shared, so in this repository all `input.txt` and `input.answers.txt` files are gitignored. Each day should have at least one `demo.txt` and `answers.txt` file, however.

Both the `answers.txt` and `input.answers.txt` file have the same format: some number of lines with a filename (minus `.txt` extension), puzzle part (1 or 2), and expected answer. For example:

```
demo1	1	56
demo2	2	44
```

Suggests that `demo1.txt` should be used for the first puzzle and has an expected answer of 56, and `demo2.txt` should be used for the second part of the puzzle and has an expected answer of 44

Note that demo files _must_ have an expected answer defined in order for them to be run. This is because the answer file also specifies which demo files should be appropriate for each section of the puzzle.

The above does not apply to the `input.txt` file: this can be run regardless of if an `input.answers.txt` file is defined. However without a defined answer, the runner is unable to determine if the code is correct. This is useful if there is a quick-and-dirty solution that generates the correct answer, and you want to refine or improve it.
