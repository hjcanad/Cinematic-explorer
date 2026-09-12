export type Movie = {
  imdbID: string
  Title: string
  Year: string
  Poster: string
  Type?: string
  Plot?: string
  Genre?: string
  Runtime?: string
  Director?: string
  imdbRating?: string
}

type OmdbResult = {
  imdbID: string
  Title?: string
  Year?: string
  Poster?: string
  Type?: string
  Plot?: string
  Genre?: string
  Runtime?: string
  Director?: string
  imdbRating?: string
  Response?: string
  Search?: OmdbResult[]
}

export const fallbackPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80'

export function posterUrl(movie: Pick<Movie, 'Poster'>): string {
  return movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : fallbackPoster
}

export function normalizeMovie(item: OmdbResult): Movie {
  return {
    imdbID: item.imdbID,
    Title: item.Title || 'Unknown title',
    Year: item.Year || '—',
    Poster: item.Poster || 'N/A',
    Type: item.Type === 'series' ? 'series' : 'movie',
    Plot: item.Plot || 'A story waiting to be discovered.',
    Genre: item.Genre,
    Runtime: item.Runtime,
    Director: item.Director,
    imdbRating: item.imdbRating,
  }
}

async function omdbRequest<T>(params: string): Promise<T | null> {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY as string | undefined
  if (!apiKey) return null

  const response = await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(apiKey)}&${params}`)

  if (!response.ok) return null
  return response.json() as Promise<T>
}

export async function fetchMovies(term: string): Promise<Movie[]> {
  const cleanTerm = term.trim()
  if (!cleanTerm) return []

  const response = await omdbRequest<OmdbResult>(`s=${encodeURIComponent(cleanTerm)}&type=movie&page=1`)
  if (!response?.Search || response.Response === 'False') return []

  return response.Search.slice(0, 18)
    .map(normalizeMovie)
}

export async function fetchMovieDetails(movie: Movie): Promise<Movie> {
  const response = await omdbRequest<OmdbResult>(`i=${encodeURIComponent(movie.imdbID)}&plot=full`)
  if (!response) return movie

  return normalizeMovie(response)
}
