import axios from "axios"
import * as cheerio from "cheerio"

import { env } from "../env"
import {
  type Cinema,
  type Movie,
  type CityId,
  type CinemaName,
  type CinemaId,
} from "./types"

export type GetMovieListResponse = {
  cinema: Cinema
  movies: Movie[]
}[]

export const getMovieList = async (
  cityId: CityId,
): Promise<GetMovieListResponse> => {
  const form = new FormData()
  form.append("cityId", cityId)
  const res = await axios.post<string>(
    `${env.MIBOLETERIA_API_BASE_URL}/parts/ajax_paso2.php`,
    form,
  )
  const $ = cheerio.load(res.data)

  const movieList: GetMovieListResponse = []

  $("li > ul").each((_, element) => {
    let cinemaName: CinemaName | undefined
    let cinemaId: CinemaId | undefined
    const movies: Movie[] = []

    $(element)
      .find("li:not(.cinema) a")
      .each((idx, a) => {
        const href = $(a).attr("href")
        if (href) {
          const params = href
            .match(/(?:'([^']*)'|\b(\d+)\b)/g)
            ?.map((param) => param.replace(/'/g, ""))
          if (params !== undefined && params.length >= 6) {
            const movieName = params[0]
            const movieId = params[4]

            if (cinemaName === undefined) {
              cinemaName = params[1]
            }
            if (cinemaId === undefined) {
              cinemaId = params[3]
            }

            movies.push({ id: movieId, name: movieName })
          }
        }
      })

    if (cinemaName === undefined) {
      throw new Error("Could not find cinema name")
    }
    if (cinemaId === undefined) {
      throw new Error("Could not find cinema id")
    }

    movieList.push({ cinema: { id: cinemaId, name: cinemaName }, movies })
  })

  return movieList
}
