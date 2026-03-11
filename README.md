# Ethara HRMS Frontend

Frontend for the Ethara HRMS application built with React, Vite, Material UI, React Router, Axios, and Day.js.

This app supports two user roles:

- Admin: login, dashboard overview, employee management, and attendance management
- Employee: login, attendance history, time in, and time out

## Features

### Admin features

- Admin login
- Dashboard with employee count and attendance summary
- Employee creation
- Employee search and department filter
- Employee deletion
- Attendance entry creation
- Attendance filtering by date and employee
- Shared timezone selector in the admin layout

### Employee features

- Employee login
- Employee attendance history
- Time in action
- Time out action
- Current session status
- Last recorded time display
- Timezone switching between `IST` and `UTC`

## Tech stack

- React 18
- Vite 5
- React Router DOM 7
- Material UI 7
- Axios
- Day.js

## Prerequisites

Install the following before starting the project:

- Node.js `20.x` recommended
- npm `9+` recommended
- Git
- A running backend API

### Check your versions

```bash
node -v
npm -v
git --version
```

## Backend dependency

This frontend depends on an HRMS backend API.

Current API base URL in the project:

```text
https://sunny-art-production-22c6.up.railway.app/api/v1/
```

The base URL is currently hardcoded in `src/services/api.js`.

## Installation

Clone the project and install dependencies:

```bash
git clone <your-repository-url>
cd "Ethara.hrms - frontend"
npm install
```

## Available scripts

### Start development server

```bash
npm run dev
```

Vite will start a local dev server, usually at:

```text
http://localhost:5173
```

### Build for production

```bash
npm run build
```

This generates the production-ready files in the `dist` folder.

### Preview production build locally

```bash
npm run preview
```

## Important run note

Do not open the root `index.html` file directly in the browser.

This is a Vite app and must be:

- served through `npm run dev` during development, or
- served from the generated `dist` folder after running `npm run build`

## Project routes

### Public routes

- `/login` -> admin login
- `/employee/login` -> employee login

### Protected admin routes

- `/` -> admin dashboard
- `/employees` -> employee management
- `/attendance` -> attendance management

### Protected employee routes

- `/employee` -> employee dashboard

## Authentication flow

Authentication data is stored in `localStorage`.

Stored keys:

- `token`
- `user`
- `role`
- `preferred_timezone`

Role-based routing behavior:

- admin users are redirected to `/`
- employee users are redirected to `/employee`

If an API request returns `401`, the stored auth data is cleared automatically.

## Admin module details

### 1. Admin login

Admin login is available at:

```text
/login
```

The form submits:

```text
POST admin/login/
```

Form fields:

- `email`
- `password`

### 2. Dashboard

The admin dashboard shows:

- total employees
- present today
- absent today
- recent attendance records

The dashboard loads data from:

- `GET admin/employees/`
- `GET employee/attendance/`

### 3. Employee management

The employee management page supports:

- adding employees
- searching employees
- filtering by department
- deleting employees

Employee creation form fields:

- `full_name`
- `email_address`
- `department`
- `password`

APIs used:

- `GET admin/employees/`
- `POST admin/employees/`
- `DELETE admin/employees/{id}/`

### 4. Attendance management

The attendance page supports:

- creating attendance entries
- viewing attendance records
- filtering by date
- filtering by employee

Attendance form fields:

- `employee`
- `date`
- `status`
- `time_in`
- `time_out`

Attendance rules in UI:

- if status is `Present`, `time_in` and `time_out` are required
- if status is `Absent`, time fields are disabled

APIs used:

- `GET employee/attendance/`
- `POST employee/attendance/`
- `GET admin/employees/`

## Employee module details

### 1. Employee login

Employee login is available at:

```text
/employee/login
```

The form submits:

```text
POST employee/login/
```

Form fields:

- `email`
- `password`

### 2. Employee dashboard

The employee dashboard shows:

- attendance record count
- present day count
- absent day count
- current day status
- current session state
- full attendance history

Employee actions:

- `Time In`
- `Time Out`
- `Logout`

APIs used:

- `GET employee/attendance/`
- `POST employee/time-in`
- `POST employee/time-out`

## Timezone support

The application supports two timezone options:

- `IST`
- `UTC`

Timezone selection is stored in browser `localStorage` using the key:

```text
preferred_timezone
```

## API endpoints used by this frontend

```text
POST   /api/v1/admin/login/
POST   /api/v1/employee/login/
GET    /api/v1/admin/employees/
POST   /api/v1/admin/employees/
DELETE /api/v1/admin/employees/{id}/
GET    /api/v1/employee/attendance/
POST   /api/v1/employee/attendance/
POST   /api/v1/employee/time-in
POST   /api/v1/employee/time-out
```

## Project structure

```text
.
|-- public/
|-- src/
|   |-- components/
|   |-- contexts/
|   |-- layouts/
|   |-- pages/
|   |-- routes/
|   |-- services/
|   |-- utils/
|   |-- App.js
|   |-- index.css
|   `-- main.js
|-- index.html
|-- netlify.toml
|-- package.json
`-- vite.config.js
```

### Main folders

- `src/components/` -> reusable UI blocks such as tables, forms, sidebar, topbar
- `src/pages/` -> route-level pages
- `src/services/` -> API client and auth helpers
- `src/routes/` -> route protection logic
- `src/utils/` -> attendance and timezone helpers
- `src/contexts/` -> shared React context for timezone state
- `src/layouts/` -> admin layout with sidebar and topbar

## How the app starts

Entry file:

```text
src/main.js
```

It sets up:

- Material UI theme
- CSS baseline
- timezone provider
- browser router
- root app rendering

## Deployment

### Netlify deployment

This project already includes a `netlify.toml` file.

Netlify settings:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20`

SPA redirect is already configured so app routes like `/employees` and `/attendance` work after refresh.

### Deploy from Git repository

1. Push the project to GitHub, GitLab, or Bitbucket.
2. Open Netlify.
3. Choose `Add new site`.
4. Import the repository.
5. Netlify should read `netlify.toml` automatically.
6. Start the deploy.

If you want to enter values manually in the Netlify UI, use:

```text
Build command: npm run build
Publish directory: dist
```

### Manual deploy on Netlify

1. Run:

```bash
npm run build
```

2. Upload only the `dist` folder to Netlify.

Do not upload the full source project folder for manual deploy.

## Local development workflow

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the local Vite URL in the browser.

4. Log in as admin or employee.

## Troubleshooting

### Error: `Unable to start the app`

Cause:

- the source `index.html` was opened directly, or
- the app was not served through Vite or from `dist`

Fix:

- use `npm run dev` for local development
- use `npm run build` and deploy `dist` for production

### Error: `Unexpected token '<'`

Cause:

- the browser received HTML where JavaScript was expected
- this usually happens when the wrong file is being served

Fix:

- run with Vite locally
- publish the `dist` folder in production

### Login works locally but fails after deployment

Possible causes:

- backend API is down
- backend CORS does not allow the deployed frontend domain
- wrong API URL

Check:

- backend health
- browser network tab
- backend CORS settings

### Netlify page opens but refresh on routes fails

This is normally fixed by the included `netlify.toml` redirect rule.

If you remove that file, routes like `/employees` or `/employee` may return `404` on refresh.

## Notes for future improvement

- move API base URL to an environment variable such as `VITE_API_BASE_URL`
- add test coverage
- add edit employee support
- add pagination for employee and attendance tables
- add stronger form validation and user feedback

## Install dependencies list

Main dependencies installed in this project:

```text
@emotion/react
@emotion/styled
@mui/icons-material
@mui/material
axios
dayjs
react
react-dom
react-router-dom
```

Dev dependencies:

```text
@vitejs/plugin-react
vite
```

## Quick start

```bash
npm install
npm run dev
```

For production:

```bash
npm run build
npm run preview
```
