# Brain Bucket API Consumer

A lightweight frontend app that demonstrates an **Auth Gateway UI** pattern while consuming a REST API.

## What the Auth Gateway UI is

The Auth Gateway keeps auth behavior consistent by using one shared script (`/assets/js/auth-gateway.js`) for:

- checking login state (`isAuthenticated`)
- reading session user (`getSessionUser`)
- protecting pages (`requireAuth`)
- generating redirect targets (`getAuthUrl`, `getHomeUrl`)
- clearing auth state (`clearSession`)

Session state is stored in `sessionStorage` under one key.

## How auth checks work

- **Protected pages** (`/index.html`, `/pages/profile.html`) call `AuthGateway.requireAuth()` on load.
- If no valid session exists, user is redirected to `auth.html`.
- **Auth page** (`/auth.html`) checks `isAuthenticated()` on load and redirects to `index.html` if already signed in.
- On successful login form submit, a session object is stored and the user is redirected to `index.html`.

## How to call the API

Shared API client lives in `/assets/js/api-client.js` and includes:

- `API_BASE_URL` constant
- `requestJson(path, options)` helper
- optional bearer token attachment (`Authorization` header)
- clear handling for:
  - `401` (`UNAUTHORIZED`)
  - `403` (`FORBIDDEN`)
  - network failures (`NETWORK_ERROR`)

Example calls are wired on `index.html`:

- GET: `ApiClient.requestJson('/posts?_limit=3', { token })`
- POST: `ApiClient.requestJson('/posts', { method: 'POST', token, body: {...} })`

Unauthorized responses are handled via `ApiClient.handleUnauthorized(error)`, which clears session and redirects to `auth.html`.

## Redirect behavior and paths

Redirect URLs come from `AuthGateway.getAuthUrl()` and `AuthGateway.getHomeUrl()`. These are generated from the shared script location so redirects work from both root pages and nested pages like `/pages/profile.html`.

## Folder structure

- `/auth.html` (auth page)
- `/index.html` (protected home page)
- `/pages/profile.html` (second protected page)
- `/assets/js/auth-gateway.js` (shared auth guard)
- `/assets/js/api-client.js` (shared API layer)
- `/assets/js/auth-page.js`, `/assets/js/index-page.js`, `/assets/js/profile-page.js`
- `/assets/css/styles.css`
