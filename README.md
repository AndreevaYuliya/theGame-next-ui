# theGame-next-ui

## What’s implemented (task)
- Based on the `ui-base-app-next` template.
- Two pages: Entity list (Movies) and Entity detail.
- List:
  - Pagination with state in URL (page/filters persist on reload).
  - Filters by title and year range; applied on BE, params stored in URL.
  - “Add entity” opens the detail page in create mode.
  - Click on a card opens movie detail.
  - Delete with confirmation, removal from the list, and auto-hiding toast for success/error.
- Detail page:
  - Two modes: view and edit; default is view, `/movieDetails/new` opens edit/create.
  - Edit all fields, UI validation (required fields, numeric formats, ranges).
  - Save/create with toasts; stays in edit on error.
  - Cancel restores previous values (on create — returns to list).
  - “Back” returns to the list preserving filters/pagination.
  - Country auto-filled when selecting director; director is required.
- Toasts shown and auto-hide after create/update/delete operations.

## Navigation
- Movies list: `${UI_URL_PREFIX}/movies`
- Movie detail: `${UI_URL_PREFIX}/movieDetails/:movieId` (`new` for creation)
- Login: `${UI_URL_PREFIX}/login`
- Template default page: `${UI_URL_PREFIX}/default` (optionally redirect to movies for logical flow).

## Backend & env
- Frontend runs on port 3050 (`npm start`).
- Backend URL is configured via env: `REACT_APP_MOVIES_SERVICE` (e.g. `http://localhost:8080/api` from the previous assignment).
- UI route prefix: `REACT_APP_UI_URL_PREFIX` (leave empty if not needed).

## Run
```bash
npm install
npm start   # port 3050
```

## Settings
- src/config/index.js uses REACT_APP_MOVIES_SERVICE and REACT_APP_UI_URL_PREFIX.
- Auth/axios interceptors — from the base template.
