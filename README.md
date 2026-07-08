# Brain Bucket API Consumer

Beginner-friendly frontend demo that consumes a JWT auth API and shows a simple auth gateway pattern.

## API Source

This frontend consumes the auth API hosted here:

https://github.com/barrycumbie/micro-jwt-authn-api-demo

> this is backend Node.js-Express.js code deployed on a GCP VM instance...stuff for later classes

## Learning Goal

- Understand public vs protected page behavior.
- Practice logging in and storing a token in `sessionStorage`.
- See redirect rules when users are not authenticated.
- Run one authenticated API request from the UI.

## Demo Steps

### Step 1: Start On auth.html (Public)

- Page: `auth.html`
- Action: Enter display name + password and click Login.
- What happens:
  - Calls `POST http://136.116.192.154/api/authn/login`
  - Saves `{ username, token }` to `sessionStorage`
  - Redirects to `index.html`

### Step 2: Land On index.html (Protected)

- Page: `index.html`
- What happens on load:
  - Checks for valid session
  - If missing/invalid, redirects to `auth.html`
- What to test:
  - Click “Run GET health” to call `GET http://136.116.192.154/health` with bearer token
  - Click Sign Out to clear session and return to `auth.html`

### Step 3: Open pages/profile.html (Protected Nested Page)

- Page: `pages/profile.html`
- What happens on load:
  - Checks for valid session
  - If missing/invalid, redirects to `../auth.html`
- Why this page exists:
  - Proves the same auth guard behavior works from a nested folder route

## Main Functionality (Simple Setup)

- One script per page:
  - `assets/js/auth.js`
  - `assets/js/index.js`
  - `assets/js/profile.js`
- Shared session key: `brainBucketSession`.
- Auth guard behavior is consistent across protected pages.
- Handles common API failure cases: invalid credentials, unauthorized/forbidden, and network errors.

## Quick Start

1. Make sure the API is reachable at `http://136.116.192.154`.
2. Open `auth.html` in a browser (or serve the repo with any static server).
3. Follow Step 1, Step 2, and Step 3 above.
