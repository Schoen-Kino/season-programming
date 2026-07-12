# schön.kino Season Programming

![Deploy Status](https://github.com/Schon-Kino/season-programming/actions/workflows/deploy.yml/badge.svg)

## About schön.kino

schön.kino is a living space cinema hosted in Vienna, featuring carefully curated film screenings every Thursday at 19h30. Each season follows a specific theme and presents a selection of films that explore different aspects of that theme.

## How the site works

Seasons are **data, not pages**. Everything about a season (theme, blurb, film program, showtime) lives in [`data/seasons.json`](data/seasons.json). On every push to `main`, the deploy workflow runs [`build/build.js`](build/build.js) (plain Node, no dependencies), which generates one static page per season from [`templates/season.html`](templates/season.html) into `_site/` and publishes it to GitHub Pages.

All standard season pages share a single stylesheet, [`shared/season.css`](shared/season.css), and get their own social-preview meta tags (`og:image` points at the season's poster, so shared links show the poster).

The root page redirects to the latest season, and `archive/` lists all seasons — both read `data/seasons.json` at runtime, so they update automatically.

## Adding a new season

1. Add an entry to `data/seasons.json`:

   ```json
   {
     "number": 11,
     "theme": "DREAMING",
     "blurb": "A few sentences about the season…",
     "program": [
       { "date": "May 7", "title": "Movie Title", "credit": "Director (Year, 1h30m)" }
     ]
   }
   ```

   - **One movie or many:** just add one or more `program` entries.
   - **No program yet / single-event announcement** (like Season 10): omit `program` — only the poster and blurb are shown.
   - Optional fields: `time` (e.g. `"Doors 19:00"`, defaults to `"19h30 thursdays"`), `address`, `metaDescription`, `background` (page background color), `poster` (filename, defaults to `poster-seasonN.jpg`), `title` (browser tab title).
   - Program entries also support `past: true` (dims already-screened items), `alert` (e.g. `"Rescheduled: June 17!"`), and `shorts` (a list of `{ "title", "credit" }` for shorts nights).

2. Create `seasons/season11/images/` and drop in the poster as `poster-season11.jpg` (plus optionally `favicon.ico` / `apple-touch-icon.png`, copied from a previous season).

3. Push to `main`. That's it — the season page, the archive card, and the root redirect all update automatically.

### Custom seasons (the escape hatch)

For a fully bespoke page (like Season 4 "SWIMMING", where the page itself is the poster), mark the season `"custom": true` in `data/seasons.json` and hand-build `seasons/seasonN/` with its own `index.html` / `styles.css` / assets. The build copies the folder verbatim.

## Building locally

```bash
node build/build.js
cd _site && python3 -m http.server 8000
# open http://localhost:8000
```

## Navigation

- From any season page, click the "Season Archive" button in the top right to view all seasons
- From the archive, click on any season card to view that season's details
- Use the "Current Season" button in the archive to return to the latest season
