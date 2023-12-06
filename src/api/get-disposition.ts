import axios from "axios"
import { z } from "zod"

import { env } from "../env"
import type { CinemaId, CinemaWSCode, MovieTimeId, Disposition } from "./types"

export type GetSeatsResponse = Disposition

const ResponseSchema = z.object({
  width: z.coerce.number(),
  height: z.coerce.number(),
  seats: z.array(
    z.object({
      code: z.string(),
      x: z.coerce.number(),
      y: z.coerce.number(),
      status: z.number(),
    }),
  ),
})
type Response = z.infer<typeof ResponseSchema>

export const getDisposition = async (
  cinemaId: CinemaId,
  movieTimeId: MovieTimeId,
  cinemaWSCode: CinemaWSCode,
): Promise<GetSeatsResponse> => {
  const form = new FormData()
  form.append("cinemaId", cinemaId)
  form.append("performaceId", movieTimeId)
  form.append("cinemaWSCode", cinemaWSCode)

  const res = await axios.post<Response>(
    `${env.MIBOLETERIA_API_BASE_URL}/parts/ajax_paso3Bis.php`,
    form,
  )

  const parseResponse = ResponseSchema.safeParse(res.data)

  if (!parseResponse.success) {
    throw new Error(
      `Could not find seats for time ${movieTimeId} in cinema ${cinemaId}`,
    )
  }

  const disposition: Disposition = {
    width: parseResponse.data.width,
    height: parseResponse.data.height,
    seats: parseResponse.data.seats.map((seat) => {
      return {
        id: seat.code,
        x: seat.x,
        y: seat.y,
        isAvailable: seat.status === 1,
      }
    }),
    available: 0,
  }

  disposition.available = disposition.seats.filter(
    (seat) => seat.isAvailable,
  ).length

  return disposition
}
