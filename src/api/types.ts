export interface City {
  id: CityId
  name: CityName
}
export type CityId = string
export type CityName = string

export interface Movie {
  id: MovieId
  name: MovieName
}
export type MovieId = string
export type MovieName = string

export interface Cinema {
  id: CinemaId
  name: CinemaName
}
export type CinemaId = string
export type CinemaName = string

export interface MovieTime {
  id: MovieTimeId
  date: string
  time: string
  theaterId: string
  cinemaWSCode: CinemaWSCode
}

export type MovieTimeId = string

export type CinemaWSCode = string

export interface ShowSeats {
  data: SeatsData
  available: number
  total: number
}

export interface SeatData {
  code: string
  x: string
  y: string
  status: number
}

export interface SeatsData {
  width: string
  height: string
  seats: SeatData[]
}

export interface ShowInformation {
  id: MovieTimeId
  theaterId: CinemaId
  cinemaWSCode: CinemaWSCode
}
