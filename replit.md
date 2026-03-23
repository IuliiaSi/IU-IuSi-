# Anti-Scam in Service (Анти-развод в сервисе)

An educational MVP landing page for used car owners (4–10 years old) that helps them get a "second opinion" on car service recommendations.

## Project Structure

- `Lectures&HW/projects/` — Main static site files
  - `index.html` — Landing page (in Russian)
  - `style.css` — Stylesheet
  - `script.js` — Client-side form validation and smooth scroll
  - `homework1.md`, `homework2.md` — Project documentation/requirements
- `server.js` — Simple Node.js HTTP server to serve static files

## Tech Stack

- Static HTML/CSS/JavaScript (no build system, no package manager)
- Node.js built-in `http` module for serving files in development and production

## Running the App

The app is served via `server.js` on port 5000:

```
node server.js
```

## Deployment

Configured as `autoscale` deployment running `node server.js`.
