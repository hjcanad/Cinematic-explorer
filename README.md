# Cinematic Explorer

A responsive React movie discovery app powered by Vite and the OMDb API.

## Features

- Search movies using OMDb
- Reliable fallback catalog when no API key is configured
- Movie detail view with plot, rating, runtime, genre, and director
- Filter by type and release year
- Sort by newest release year
- Responsive navigation, content area, and footer

## Run locally

```powershell
npm install
npm run dev
```

Create a `.env` file for live TMDb search:

```env
VITE_OMDB_API_KEY=your_omdb_api_key
```

Never commit `.env`. It is excluded by `.gitignore`.

## Enable search on GitHub Pages

1. Sign up for an OMDb API key.
2. In GitHub, open **Settings > Secrets and variables > Actions**.
3. Create a repository secret named `VITE_OMDB_API_KEY` and put only the key in the **Secret** box.
4. In **Settings > Pages**, set the source to **GitHub Actions**.
5. Push to `main` and GitHub will deploy the app automatically.

This project is configured for a public GitHub Pages deployment and works with a local fallback catalog even before the key is added.
