import type { SeatsData } from "./api/types"

export const generateSeatsMatrix = (seats: SeatsData): void => {
  const matrix: string[][] = []
  const height = Number(seats.height)
  const width = Number(seats.width)

  for (let i = 0; i < height; i++) {
    matrix[i] = new Array<string>(width).fill(" ")
  }

  let maxWidth = 0
  for (const seat of seats.seats) {
    matrix[Number(seat.y)][Number(seat.x)] =
      seat.status === 2
        ? String.fromCodePoint(0x1f512)
        : String.fromCodePoint(0x1fa91)
    if (Number(seat.x) > maxWidth) maxWidth = Number(seat.x)
  }

  console.log(String.fromCodePoint(0x2b1c).repeat(maxWidth))
  console.log()
  let allEmpty = true
  for (const row of matrix) {
    let line = ""
    for (const seat of row) {
      line += seat
    }
    allEmpty = allEmpty && line.trim() === ""
    if (!allEmpty) console.log(line)
  }
}
