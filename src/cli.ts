import { createWriteStream } from "fs"
import prompts from "prompts"

import { getCities } from "./api/get-cities"
import { getDisposition } from "./api/get-disposition"
import { getMovieList } from "./api/get-movie-list"
import { getMovieSchedule } from "./api/get-movie-schedule"
import type {
  CinemaId,
  MovieId,
  CityId,
  MovieTimeId,
  CinemaWSCode,
} from "./api/types"
import { buildHtml, generateSeatsMatrix } from "./util"
import open from "open"
import tmp from "tmp"

export const startPrompt = async () => {
  // Get cities
  const cities = await getCities()
  const cityResponse = await prompts(
    {
      type: "select",
      name: "cityId",
      message: "Hola! ¿De qué ciudad sos?",
      choices: cities.map((city) => ({
        title: city.name,
        value: city.id,
      })),
    },
    {
      onCancel: exit,
    },
  )
  const cityId = cityResponse.cityId as CityId

  // Get cinema
  const movieList = await getMovieList(cityId)

  interface CinemaResponse {
    cinemaId: CinemaId
    cityId: CityId
  }
  const cinemaResponse = await prompts(
    {
      type: "select",
      name: "cinema",
      message: "En qué cine estabas buscando?",
      choices: movieList.map((movie) => ({
        title: movie.cinema.name,
        value: {
          cinemaId: movie.cinema.id,
          cityId: movie.cinema.cityId,
        } satisfies CinemaResponse,
      })),
    },
    {
      onCancel: exit,
    },
  )
  const cinema = cinemaResponse.cinema as CinemaResponse

  // Get movie
  const movieResponse = await prompts(
    {
      type: "select",
      name: "movieId",
      message: "Qué película tenés ganas de ver?",
      choices: () => {
        const selectedCinemaMovies = movieList.find(
          (movie) => movie.cinema.id === cinema.cinemaId,
        )?.movies
        if (!selectedCinemaMovies) {
          return []
        }
        return selectedCinemaMovies.map((movie) => ({
          title: movie.name,
          value: movie.id,
        }))
      },
    },
    {
      onCancel: exit,
    },
  )

  // Get time
  const movieSchedule = await getMovieSchedule(
    cinema.cityId,
    cinema.cinemaId,
    movieResponse.movieId as MovieId,
  )

  interface ShowResponse {
    cinemaId: string
    id: MovieTimeId
    cinemaWSCode: CinemaWSCode
  }

  const showResponse = await prompts(
    {
      type: "select",
      name: "show",
      message: "A qué hora querés ir?",
      choices: movieSchedule.map((movie) => ({
        title: `${movie.date} ${movie.time}`,
        value: {
          id: movie.id,
          cinemaId: movie.cinemaId,
          cinemaWSCode: movie.cinemaWSCode,
        } satisfies ShowResponse,
      })),
    },
    {
      onCancel: exit,
    },
  )

  // Show seats
  const show = showResponse.show as ShowResponse
  const disposition = await getDisposition(
    show.cinemaId,
    show.id,
    show.cinemaWSCode,
  )

  console.log(`Existen ${disposition.available} asientos disponibles.`)
  generateSeatsMatrix(disposition)

  const openResponse = await prompts(
    {
      type: "confirm",
      name: "open",
      message: "Querés abrir el navegador para comprar las entradas?",
      initial: true,
    },
    {
      onCancel: exit,
    },
  )

  if (openResponse.open) {
    const tmpFile = tmp.fileSync({ postfix: ".html" })
    console.log(tmpFile.name)
    const fs = createWriteStream(tmpFile.name)
    fs.once("open", () => {
      fs.end(
        buildHtml(
          cinema.cityId,
          cinema.cinemaId,
          movieResponse.movieId as MovieId,
          show.id,
        ),
      )
    })
    await open(tmpFile.name)
  }

  const continueResponse = await prompts(
    {
      type: "confirm",
      name: "continue",
      message: "Querés hacer otra consulta?",
      initial: true,
    },
    {
      onCancel: exit,
    },
  )

  if (!continueResponse.continue) {
    exit()
  }
}

const exit = () => {
  console.log("\nGracias por usar nuestra tool! Saludos desde namic 😁")
  process.exit(0)
}
