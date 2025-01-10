import { puzzles as puzzles2015 } from './2015'
import { puzzles as puzzles2016 } from './2016'
import { puzzles as puzzles2017 } from './2017'
import { puzzles as puzzles2018 } from './2018'
import { puzzles as puzzles2019 } from './2019'
import { puzzles as puzzles2020 } from './2020'
import { puzzles as puzzles2021 } from './2021'
import { puzzles as puzzles2022 } from './2022'
import { puzzles as puzzles2023 } from './2023'
import { puzzles as puzzles2024 } from './2024/typescript'

type Puzzle = (content: string, filename: string) => string | number

export const puzzles = {
	puzzles2015,
	puzzles2016,
	puzzles2017,
	puzzles2018,
	puzzles2019,
	puzzles2020,
	puzzles2021,
	puzzles2022,
	puzzles2023,
	puzzles2024
} as Record<string, Record<string, Puzzle>>
