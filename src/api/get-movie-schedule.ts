import axios from "axios"
import * as cheerio from "cheerio"

import { env } from "../env"
import {
  type CityId,
  type CinemaId,
  type MovieId,
  type MovieTime,
} from "./types"

export type GetMovieScheduleResponse = MovieTime[]

export const getMovieSchedule = async (
  cityId: CityId,
  cinemaId: CinemaId,
  movieId: MovieId,
): Promise<GetMovieScheduleResponse> => {
  const form = new FormData()
  form.append("cityId", cityId)
  form.append("cinemaId", cinemaId)
  form.append("showId", movieId)
  const res = await axios.post<string>(
    `${env.MIBOLETERIA_API_BASE_URL}/parts/ajax_horariosShow.php`,
    form,
  )
  const $ = cheerio.load(res.data)

  const movieSchedule: MovieTime[] = []

  $(".dates li ul").each((index, ul) => {
    $(ul)
      .find("li:not(.date) a")
      .each((idx, a) => {
        const href = $(a).attr("href")
        if (href && href.startsWith("javascript:seleccionarTime")) {
          // Regex to extract parameters from the JavaScript function call in href
          const params = href
            .match(/(?:'([^']*)'|\b(\d+)\b)/g)
            ?.map((param) => param.replace(/'/g, ""))
          if (params && params.length >= 7) {
            const date = params[0]
            const time = params[2]
            const id = params[3]
            const theaterId = params[6]
            movieSchedule.push({ date, time, id, theaterId })
          }
        }
      })
  })

  return movieSchedule
}
