import type { Disposition } from "./api/types"

export const generateSeatsMatrix = (disposition: Disposition): void => {
  const matrix: string[][] = []
  const height = disposition.height
  const width = disposition.width

  for (let i = 0; i < height; i++) {
    matrix[i] = new Array<string>(width).fill(" ")
  }

  let maxWidth = 0
  for (const seat of disposition.seats) {
    matrix[seat.y][seat.x] = seat.isAvailable
      ? String.fromCodePoint(0x1fa91) // 🪑
      : String.fromCodePoint(0x1f512) // 🔒
    if (seat.x > maxWidth) maxWidth = seat.x
  }

  console.log(String.fromCodePoint(0x2b1c).repeat(maxWidth)) // ⬜
  console.log()

  let isEmptyStart = true
  for (const row of matrix) {
    let line = ""
    for (const seat of row) {
      line += seat
    }

    const isLineEmpty = line.trim() === ""

    if (isEmptyStart && isLineEmpty) {
      continue
    }
    if (isEmptyStart && !isLineEmpty) {
      isEmptyStart = false
    }

    console.log(line)
  }
}
