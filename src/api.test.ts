import { describe, expect, it } from 'vitest'
import { normalizeMovie, posterUrl } from './api'

describe('movie normalization', () => {
  it('creates a usable movie object from OMDb results', () => {
    const movie = normalizeMovie({
      imdbID: 'tt1375666',
      Title: 'Inception',
      Year: '2010',
      Poster: 'https://example.com/abc.jpg',
      Plot: 'A dream thief enters dreams.',
      imdbRating: '8.8',
    })

    expect(movie.imdbID).toBe('tt1375666')
    expect(movie.Title).toBe('Inception')
    expect(movie.Year).toBe('2010')
    expect(movie.Poster).toContain('/abc.jpg')
    expect(movie.Plot).toBe('A dream thief enters dreams.')
    expect(movie.imdbRating).toBe('8.8')
  })

  it('uses the fallback poster when no poster exists', () => {
    expect(posterUrl({ Poster: 'N/A' } as any)).toContain('images.unsplash.com')
    expect(posterUrl({ Poster: '/poster.jpg' } as any)).toContain('/poster.jpg')
  })
})
