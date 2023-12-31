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
  date: Date
  cinemaId: CinemaId
  cinemaWSCode: CinemaWSCode
  isAllocationEnabled: boolean
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
