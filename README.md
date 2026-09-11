# Cinematic Explorer

A responsive React movie discovery app powered by Vite and the OMDb API.

## Features

- Search movies and series through OMDb
- Local fallback catalog when no API key is configured
- Movie detail view with plot, rating, runtime, genre, and director
- Filter by type and release year
- Sort by newest release year
- Responsive navigation, content area, and footer

## Run locally

```powershell
npm install
npm run dev
```

Create a `.env` file for live OMDb search:

```env
VITE_OMDB_API_KEY=your_api_key
```

Never commit `.env`. It is excluded by `.gitignore`.
