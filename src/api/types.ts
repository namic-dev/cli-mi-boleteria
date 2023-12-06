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
  cityId: CityId
}
export type CinemaId = string
export type CinemaName = string

export interface MovieTime {
  id: MovieTimeId
  date: string
  time: string
  cinemaId: CinemaId
  cinemaWSCode: CinemaWSCode
}
export type MovieTimeId = string
export type CinemaWSCode = string

export interface Seat {
  id: SeatId
  x: number
  y: number
  isAvailable: boolean
}
export type SeatId = string

export interface Disposition {
  width: number
  height: number
  seats: Seat[]
  available: number
}

/*
export interface ShowSeats {
  data: SeatsData
  available: number
  total: number
}

export interface SeatData {
  code: string
  x: number
  y: number
  isAvailable: boolean
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
*/
