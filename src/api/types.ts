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
}
export type MovieTimeId = string
