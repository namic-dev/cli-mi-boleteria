import axios from "axios"

import { env } from "../env"
import type {
  CinemaId,
  MovieTimeId,
  CinemaWSCode,
  SeatsData,
  ShowSeats,
} from "./types"

export type GetSeatsResponse = ShowSeats

export const getSeats = async (
  cinemaId: CinemaId,
  movieTimeId: MovieTimeId,
  cinemaWSCode: CinemaWSCode,
): Promise<GetSeatsResponse> => {
  const form = new FormData()
  form.append("cinemaId", cinemaId)
  form.append("performaceId", movieTimeId)
  form.append("cinemaWSCode", cinemaWSCode)

  const res = await axios.post<SeatsData>(
    `${env.MIBOLETERIA_API_BASE_URL}/parts/ajax_paso3Bis.php`,
    form,
  )

  if (!res.data.seats) {
    throw new Error(
      `Could not find seats for time ${movieTimeId} in cinema ${cinemaId}`,
    )
  }

  let available = 0
  res.data.seats.forEach((seat) => {
    if (seat.status == 1) available++
  })

  const seats = {
    data: res.data,
    available: available,
    total: res.data.seats.length,
  }

  return seats
}
