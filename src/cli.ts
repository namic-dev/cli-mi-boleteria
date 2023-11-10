import prompts from "prompts"

import { getCities } from "./api/get-cities"
import { getMovieList } from "./api/get-movie-list"
import { getMovieSchedule } from "./api/get-movie-schedule"
import { type CinemaId, type MovieId, type CityId } from "./api/types"

export const startPrompt = async () => {
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

  const movieList = await getMovieList(cityId)

  const cinemaResponse = await prompts({
    type: "select",
    name: "cinemaId",
    message: "En qué cine estabas buscando?",
    choices: movieList.map((movie) => ({
      title: movie.cinema.name,
      value: movie.cinema.id,
    })),
  })
  const movieResponse = await prompts({
    type: "select",
    name: "movieId",
    message: "Qué película tenés ganas de ver?",
    choices: () => {
      const selectedCinemaMovies = movieList.find(
        (movie) => movie.cinema.id === cinemaResponse.cinemaId,
      )?.movies
      if (!selectedCinemaMovies) {
        return []
      }
      return selectedCinemaMovies.map((movie) => ({
        title: movie.name,
        value: movie.id,
      }))
    },
  })
  const movieSchedule = await getMovieSchedule(
    cityId,
    cinemaResponse.cinemaId as CinemaId,
    movieResponse.movieId as MovieId,
  )
  const timeResponse = await prompts({
    type: "select",
    name: "time",
    message: "A qué hora querés ir?",
    choices: movieSchedule.map((movie) => ({
      title: `${movie.date} ${movie.time}`,
      value: { id: movie.id, theaterId: movie.theaterId },
    })),
  })
}

const exit = () => {
  console.log("\nGracias por usar nuestra tool! Saludos desde namic 😁")
  process.exit(0)
}
