import type {
  CinemaId,
  CityId,
  Disposition,
  MovieId,
  MovieTimeId,
} from "./api/types"

export const generateSeatsMatrix = (disposition: Disposition): void => {
  const matrix: string[][] = []
  const height = disposition.height
  const width = disposition.width

  for (let i = 0; i < height; i++) {
    matrix[i] = new Array<string>(width).fill("  ")
  }

  let maxWidth = 0
  for (const seat of disposition.seats) {
    matrix[seat.y][seat.x] = seat.isAvailable
      ? String.fromCodePoint(0x1fa91) // 🪑
      : String.fromCodePoint(0x1f512) // 🔒
    if (seat.x > maxWidth) maxWidth = seat.x
  }

  console.log(String.fromCodePoint(0x2b1c).repeat(maxWidth + 2)) // ⬜
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

export const buildHtml = (
  cityId: CityId,
  cinemaId: CinemaId,
  movieId: MovieId,
  showId: MovieTimeId,
): string => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Boletería</title>
  </head>
  <body>
    <form 
      action="https://miboleteria.com.ar/compraExterna.php" 
      method="post" 
      id="form" 
      enctype="application/x-www-form-urlencoded"
    >
      <input type="hidden" name="cineId" value="${cinemaId}">
      <input type="hidden" name="showId" value="${movieId}">
      <input type="hidden" name="cityId" value="${cityId}">
      <input type="hidden" name="performanceId" value="${showId}">
    </form>
    <script>
      window.location = "javascript:document.getElementById('form').submit()"
    </script>
  </body>
  `
}

export const getDate = (date: string, time: string): Date => {
  const year = Number(date.substring(0, 4))
  const month = Number(date.substring(4, 6)) - 1
  const day = Number(date.substring(6, 8))
  const hour = Number(time.substring(0, 2))
  const minute = Number(time.substring(3, 5))
  return new Date(year, month, day, hour, minute)
}
