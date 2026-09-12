import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { createRoot } from 'react-dom/client'
import { fallbackPoster, fetchMovieDetails, fetchMovies, posterUrl, type Movie } from './api'
import './style.css'

const fallbackMovies: Movie[] = [
  { imdbID: 'tt0816692', Title: 'Interstellar', Year: '2014', Poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', Type: 'movie', Genre: 'Adventure, Drama, Sci-Fi', Runtime: '2h 49m', Director: 'Christopher Nolan', imdbRating: '8.7', Plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.' },
  { imdbID: 'tt4154796', Title: 'Avengers: Endgame', Year: '2019', Poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', Type: 'movie', Genre: 'Adventure, Drama, Sci-Fi', Runtime: '3h 1m', Director: 'Anthony Russo, Joe Russo', imdbRating: '8.4', Plot: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse the damage.' },
  { imdbID: 'tt1375666', Title: 'Inception', Year: '2010', Poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', Type: 'movie', Genre: 'Action, Adventure, Sci-Fi', Runtime: '2h 28m', Director: 'Christopher Nolan', imdbRating: '8.8', Plot: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.' },
  { imdbID: 'tt0111161', Title: 'The Shawshank Redemption', Year: '1994', Poster: 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg', Type: 'movie', Genre: 'Drama', Runtime: '2h 22m', Director: 'Frank Darabont', imdbRating: '9.3', Plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.' },
  { imdbID: 'tt0468569', Title: 'The Dark Knight', Year: '2008', Poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', Type: 'movie', Genre: 'Action, Crime, Drama', Runtime: '2h 32m', Director: 'Christopher Nolan', imdbRating: '9.0', Plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests.' },
  { imdbID: 'tt0133093', Title: 'The Matrix', Year: '1999', Poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', Type: 'movie', Genre: 'Action, Sci-Fi', Runtime: '2h 16m', Director: 'The Wachowskis', imdbRating: '8.7', Plot: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.' },
  { imdbID: 'tt1877830', Title: 'The Batman', Year: '2022', Poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', Type: 'movie', Genre: 'Action, Crime, Drama', Runtime: '2h 56m', Director: 'Matt Reeves', imdbRating: '7.8', Plot: 'Batman ventures into Gotham City\'s underworld when a sadistic killer leaves behind a trail of cryptic clues.' },
  { imdbID: 'tt2975590', Title: 'Batman v Superman: Dawn of Justice', Year: '2016', Poster: 'https://image.tmdb.org/t/p/w500/5UsK3grJvtQrtzEgqNlDljJW96w.jpg', Type: 'movie', Genre: 'Action, Adventure, Sci-Fi', Runtime: '2h 32m', Director: 'Zack Snyder', imdbRating: '6.4', Plot: 'Fearing the actions of a god-like superhero left unchecked, Batman takes on Superman.' },
  { imdbID: 'tt1345836', Title: 'The Dark Knight Rises', Year: '2012', Poster: 'https://image.tmdb.org/t/p/w500/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg', Type: 'movie', Genre: 'Action, Crime, Drama', Runtime: '2h 44m', Director: 'Christopher Nolan', imdbRating: '8.4', Plot: 'Eight years after the Joker\'s reign of chaos, Batman is forced to return from his imposed exile.' },
  { imdbID: 'tt0096895', Title: 'Batman', Year: '1989', Poster: 'https://image.tmdb.org/t/p/w500/4GxlWMF6R1dE3h8c9M8d3R0D3S6.jpg', Type: 'movie', Genre: 'Action, Crime', Runtime: '2h 6m', Director: 'Tim Burton', imdbRating: '7.5', Plot: 'The Dark Knight of Gotham City begins his fight against a bizarre criminal called the Joker.' },
  { imdbID: 'tt0372784', Title: 'Batman Begins', Year: '2005', Poster: 'https://image.tmdb.org/t/p/w500/8RW2runwLhKHxwjGfZJZxOVL6hX.jpg', Type: 'movie', Genre: 'Action, Crime, Drama', Runtime: '2h 20m', Director: 'Christopher Nolan', imdbRating: '8.2', Plot: 'After training with his mentor, Batman begins his fight to free crime-ridden Gotham City from corruption.' },
  { imdbID: 'tt0103776', Title: 'Batman Returns', Year: '1992', Poster: 'https://image.tmdb.org/t/p/w500/jKBjeXM7iBBV9UkUcOXx3m7FSHY.jpg', Type: 'movie', Genre: 'Action, Crime, Fantasy', Runtime: '2h 6m', Director: 'Tim Burton', imdbRating: '7.1', Plot: 'Batman battles a deformed man calling himself the Penguin while also facing a former employee who becomes Catwoman.' },
  { imdbID: 'tt0112462', Title: 'Batman Forever', Year: '1995', Poster: 'https://image.tmdb.org/t/p/w500/5lWbYV2e1QKk7YJkGZx6d4gM6t.jpg', Type: 'movie', Genre: 'Action, Adventure', Runtime: '2h 1m', Director: 'Joel Schumacher', imdbRating: '5.4', Plot: 'Batman must save Gotham from Two-Face and the Riddler while taking on a new partner.' },
  { imdbID: 'tt0118688', Title: 'Batman & Robin', Year: '1997', Poster: 'https://image.tmdb.org/t/p/w500/cGRDufDDSrFrv7VI4YnmWnLk2G.jpg', Type: 'movie', Genre: 'Action, Crime, Fantasy', Runtime: '2h 5m', Director: 'Joel Schumacher', imdbRating: '3.8', Plot: 'Batman and Robin try to keep their relationship together while stopping Mr. Freeze and Poison Ivy.' },
  { imdbID: 'tt4116284', Title: 'The Lego Batman Movie', Year: '2017', Poster: 'https://image.tmdb.org/t/p/w500/snGwr2gag4Fcg6JDcQ8aX4mQmG.jpg', Type: 'movie', Genre: 'Animation, Action, Comedy', Runtime: '1h 44m', Director: 'Chris McKay', imdbRating: '7.3', Plot: 'A cooler-than-ever Bruce Wayne must deal with the usual suspects as they plan to rule Gotham City.' },
  { imdbID: 'tt1569923', Title: 'Batman: Under the Red Hood', Year: '2010', Poster: 'N/A', Type: 'movie', Genre: 'Animation, Action', Runtime: '1h 15m', Director: 'Brandon Vietti', imdbRating: '8.0', Plot: 'Batman faces a mysterious vigilante who uses lethal methods to fight crime in Gotham.' },
]

const omdbApiKey = import.meta.env.VITE_OMDB_API_KEY as string | undefined
const discoveryTags = ['Sci‑Fi', 'Crime', 'Classics', 'Award Winners', 'Mind-benders']

function App() {
  const [movies, setMovies] = useState(fallbackMovies)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Movie | null>(null)
  const [sort, setSort] = useState('featured')
  const [type, setType] = useState('')
  const [year, setYear] = useState('')
  const [loading, setLoading] = useState(false)
  const [watchlist, setWatchlist] = useState<Movie[]>([])
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    if (!omdbApiKey) return

    let active = true
    void Promise.all(fallbackMovies.map(movie => fetchMovieDetails(movie)))
      .then(details => {
        if (active) setMovies(details)
      })

    return () => {
      active = false
    }
  }, [])

  const visibleMovies = useMemo(
    () => [...movies]
      .filter(movie => (!type || movie.Type === type) && (!year || movie.Year.slice(0, 4) === year))
      .sort((a, b) => sort === 'year' ? Number(b.Year.slice(0, 4)) - Number(a.Year.slice(0, 4)) : 0),
    [movies, sort, type, year],
  )

  const reset = () => {
    setSelected(null)
    setQuery('')
    setMovies(fallbackMovies)
  }

  const toggleWatchlist = (movie: Movie) => {
    setWatchlist(current => current.some(saved => saved.imdbID === movie.imdbID)
      ? current.filter(saved => saved.imdbID !== movie.imdbID)
      : [...current, movie])
  }

  const search = async (term: string) => {
    const cleanTerm = term.trim()
    setQuery(cleanTerm)

    if (!cleanTerm) {
      setMovies(fallbackMovies)
      return
    }

    if (!omdbApiKey) {
      setMovies(fallbackMovies.filter(movie => `${movie.Title} ${movie.Genre} ${movie.Director}`.toLowerCase().includes(cleanTerm.toLowerCase())))
      return
    }

    setLoading(true)
    try {
      const results = await fetchMovies(cleanTerm)
      setMovies(results.length ? results : [])
    } catch {
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const openMovie = async (movie: Movie) => {
    if (movie.Plot && movie.Director) {
      setSelected(movie)
      return
    }

    if (!omdbApiKey) {
      setSelected(movie)
      return
    }

    try {
      const details = await fetchMovieDetails(movie)
      setSelected(details)
    } catch {
      setSelected(movie)
    }
  }

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void search(query)
  }

  return <>
    <header className="topbar">
      <a className="brand" href="#" onClick={event => { event.preventDefault(); reset() }}>
        <span className="brand-mark">CE</span>
        <span>Cinematic<span>Explorer</span></span>
      </a>
      <nav>
        <a className="active" href="#discover">Discover</a>
        <a href="#watchlist">My list <span className="nav-count">{watchlist.length}</span></a>
      </nav>
      <div className="profile-wrap">
        <button className="profile" aria-label="Open profile" aria-expanded={profileOpen} onClick={() => setProfileOpen(open => !open)}>JD</button>
        {profileOpen && <div className="profile-panel"><strong>Jordan Davis</strong><span>Film enthusiast</span><small>{watchlist.length} saved {watchlist.length === 1 ? 'title' : 'titles'}</small></div>}
      </div>
    </header>

    <main>
      {selected ? (
        <MovieDetail movie={selected} onBack={() => setSelected(null)} />
      ) : (
        <>
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow">THE CURATED SCREEN</p>
              <h1>Find a story<br /><em>worth watching.</em></h1>
              <p className="hero-intro">A quieter way to discover cinema. Search the archive, follow your curiosity, and keep the films that stay with you.</p>
              <form className="search-form" onSubmit={submitSearch}>
                <span className="search-icon">/</span>
                <input id="movie-search" name="movie-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search titles, directors, genres..." aria-label="Search movies" />
                <button type="submit">Search</button>
              </form>
              <div className="quick-search">
                <span>Try</span>
                {['Dune', 'The Godfather', 'Arrival'].map(term => <button key={term} onClick={() => void search(term)}>{term}</button>)}
              </div>
              <div className="mood-row" aria-label="Mood categories">
                {discoveryTags.map(tag => <button key={tag} className="mood-pill" onClick={() => void search(tag)}>{tag}</button>)}
              </div>
              {!omdbApiKey && <p className="api-note">Local collection active <span>·</span> add an OMDb key for live search</p>}
            </div>
            <div className="hero-art">
              <div className="art-circle" />
              <div className="art-copy">
                <span>01</span>
                <strong>Stories<br />shape us.</strong>
                <small>Since the first frame</small>
              </div>
              <div className="film-strip" />
            </div>
          </section>

          <section className="catalog" id="discover">
            <div className="section-heading">
              <div>
                <p className="eyebrow">THE LIBRARY</p>
                <h2>{query ? `Results for “${query}”` : 'Featured cinema'}</h2>
              </div>
              <div className="catalog-controls">
                <label className="sort-control">
                  Type
                  <select id="movie-type" name="movie-type" value={type} onChange={event => setType(event.target.value)}>
                    <option value="">All types</option>
                    <option value="movie">Movies</option>
                    <option value="series">Series</option>
                  </select>
                </label>
                <label className="sort-control">
                  Year
                  <select id="release-year" name="release-year" value={year} onChange={event => setYear(event.target.value)}>
                    <option value="">All years</option>
                    {Array.from({ length: 47 }, (_, index) => 2026 - index).map(optionYear => <option key={optionYear} value={optionYear}>{optionYear}</option>)}
                  </select>
                </label>
                <label className="sort-control">
                  Sort
                  <select id="sort-order" name="sort-order" value={sort} onChange={event => setSort(event.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="year">Newest first</option>
                  </select>
                </label>
              </div>
            </div>

            {loading ? (
              <div className="empty"><h3>Searching the archive...</h3></div>
            ) : visibleMovies.length ? (
              <div className="movie-grid">
                {visibleMovies.map(movie => (
                  <MovieCard key={movie.imdbID} movie={movie} onSelect={() => void openMovie(movie)} isSaved={watchlist.some(saved => saved.imdbID === movie.imdbID)} onToggleList={() => toggleWatchlist(movie)} />
                ))}
              </div>
            ) : (
              <div className="empty">
                <h3>No titles found.</h3>
                <p>Try another search or explore the featured collection.</p>
                <button className="text-button" onClick={reset}>Back to collection</button>
              </div>
            )}
          </section>
          <section className="watchlist-section" id="watchlist">
            <div className="section-heading">
              <div>
                <p className="eyebrow">YOUR COLLECTION</p>
                <h2>My list</h2>
              </div>
              <span className="list-total">{watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'}</span>
            </div>
            {watchlist.length ? <div className="saved-list">{watchlist.map(movie => <article className="saved-item" key={movie.imdbID}><div><strong>{movie.Title}</strong><span>{movie.Year} · {movie.Genre?.split(',')[0] || 'Cinema'}</span></div><button onClick={() => toggleWatchlist(movie)}>Remove</button></article>)}</div> : <p className="watchlist-empty">Save a film from the catalog and it will appear here.</p>}
          </section>
        </>
      )}
    </main>

    <footer>
      <div className="brand footer-brand">
        <span className="brand-mark">CE</span>
        <span>Cinematic<span>Explorer</span></span>
      </div>
      <p>Find the next film worth remembering.</p>
      <div className="footer-links">
        <a href="#discover">Discover</a>
        <a href="#watchlist">My list</a>
        <a href="#about">About</a>
      </div>
      <small>Built for curious viewers</small>
    </footer>
  </>
}

function MovieCard({ movie, onSelect, isSaved, onToggleList }: { movie: Movie; onSelect: () => void; isSaved: boolean; onToggleList: () => void }) {
  return <article className="movie-card" onClick={onSelect}>
    <div className="poster-wrap">
      <img src={posterUrl(movie)} alt={`${movie.Title} poster`} loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackPoster }} />
      <span className="type-badge">{movie.Type === 'series' ? 'Series' : 'Film'}</span>
      <button className={`add-button${isSaved ? ' saved' : ''}`} aria-label={`${isSaved ? 'Remove' : 'Add'} ${movie.Title} ${isSaved ? 'from' : 'to'} list`} onClick={event => { event.stopPropagation(); onToggleList() }}>{isSaved ? '✓' : '+'}</button>
    </div>
    <div className="movie-meta">
      <h3>{movie.Title}</h3>
      <p className="card-director">{movie.Director || 'Director details available'}</p>
      <div>
        <span>{movie.Year}</span>
        <span className="dot">/</span>
        <span>{movie.Genre?.split(',')[0] || 'Cinema'}</span>
        <span className="rating">★ {movie.imdbRating || '—'}</span>
      </div>
    </div>
  </article>
}

function MovieDetail({ movie, onBack }: { movie: Movie; onBack: () => void }) {
  const [added, setAdded] = useState(false)

  return <section className="detail">
    <button className="back-button" onClick={onBack}><span>←</span> Back to discover</button>
    <div className="detail-layout">
      <div className="detail-poster">
        <img src={posterUrl(movie)} alt={`${movie.Title} poster`} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackPoster }} />
      </div>
      <div className="detail-copy">
        <p className="eyebrow">{movie.Type === 'series' ? 'SERIES' : 'FEATURE FILM'} / {movie.Year}</p>
        <h1>{movie.Title}</h1>
        <div className="detail-facts">
          <span className="rating-large">★ {movie.imdbRating || '—'}</span>
          <span>{movie.Runtime || '—'}</span>
          <span>{movie.Genre || '—'}</span>
        </div>
        <p className="plot">{movie.Plot || 'A story waiting to be discovered.'}</p>
        <dl>
          <div>
            <dt>Directed by</dt>
            <dd>{movie.Director || 'Unknown'}</dd>
          </div>
          <div>
            <dt>Release year</dt>
            <dd>{movie.Year}</dd>
          </div>
        </dl>
        <button className="primary-button" onClick={() => setAdded(true)}>{added ? 'Added to my list' : '+ Add to my list'}</button>
      </div>
    </div>
  </section>
}

createRoot(document.querySelector('#app')!).render(<App />)