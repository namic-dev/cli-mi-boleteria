import axios from "axios"
import * as cheerio from "cheerio"

import { env } from "../env"
import { type City } from "./types"

export type GetCitiesResponse = City[]

export const getCities = async (): Promise<GetCitiesResponse> => {
  const res = await axios.get<string>(env.MIBOLETERIA_API_BASE_URL)

  const $ = cheerio.load(res.data)
  const cities: City[] = []

  $(".options ul li").map((_, el) => {
    const name = $(el).text().trim()
    const id = $(el).attr("ref")
    if (id === undefined) {
      throw new Error(`Could not find id for city ${name}`)
    }
    cities.push({ name, id })
  })

  return cities
}
