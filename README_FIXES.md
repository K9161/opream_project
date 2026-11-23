# Opream project fixes

## Changes made

- Corrected the `i18n` import paths in all password-recovery screens.
- Moved password-recovery routes outside the authenticated dashboard layout.
- Kept session restoration local to the received JWT and saved login profile; removed the unrelated RoutePosts profile request.
- Added JWT expiry validation and consistent cleanup of access, refresh, and cached profile data on logout/invalid sessions.
- Made the login API origin configurable through `VITE_API_BASE_URL` and accepted common access/refresh token field names.
- Redirected currently supported roles to the implemented internship area rather than non-existent role dashboards.
- Added protected placeholder pages for the Applications and Notifications links already present in the sidebar.
- Removed unused React imports and unused icon imports found during static review.

## Run locally

1. Use Node.js 20.19+ (or a supported current LTS release).
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the backend origin.
4. Run `npm run dev`.

## Backend items still requiring confirmation

- The login request currently targets `POST /api/auth/login` on `VITE_API_BASE_URL`.
- The backend must return an access token. A refresh token is currently expected by the login screen as well.
- The actual password-reset request and password-update endpoints have not been supplied, so those screens remain frontend-only.
- Role-specific dashboards and API-backed Applications/Notifications pages are not implemented in this source archive.
