# Anti-Scam in Service (Анти-развод в сервисе)

An educational MVP landing page for used car owners (4–10 years old) that helps them get a "second opinion" on car service recommendations, powered by AI analysis.

## Project Structure

- `Lectures&HW/projects/` — Main static site files
  - `index.html` — Landing page (in Russian)
  - `style.css` — Stylesheet
  - `script.js` — Client-side logic: form validation, AI call, result display
  - `homework1.md`, `homework2.md` — Project documentation/requirements
- `server.js` — Node.js HTTP server: serves static files + `/api/analyze` AI endpoint

## Tech Stack

- Static HTML/CSS/JavaScript (no build system, no package manager)
- Node.js built-in `http` module for serving files
- OpenAI via Replit AI Integrations (`gpt-5-nano` model) for car service analysis
  - Env vars: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`

## Features

- Landing page explaining the service
- Lead form: collects name, email, car info, service recommendations
- **"Получить анализ от AI"** button: sends form data to `/api/analyze`, AI categorizes each service recommendation into:
  - ✅ Сделать сейчас (do now)
  - ⏳ Можно отложить (can wait)
  - ❌ Не требуется (not needed)
- "Отправить заявку" button: submits lead form
- "Отправить смету" button: sends estimate confirmation

## Running the App

```
node server.js
```

Runs on port 5000.

## API

`POST /api/analyze` — Accepts JSON with `{brand, model, year, mileage, serviceList}`, returns `{result}` with AI analysis.

## Deployment

Configured as `autoscale` deployment running `node server.js`.
