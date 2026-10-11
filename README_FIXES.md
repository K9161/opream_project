# What was fixed

- Fixed the Router structure: `useNavigate` is no longer used outside a Router.
- Fixed broken imports and file-name/path mismatches.
- Login is now a standalone route at `/login`.
- Protected routes redirect to `/login` when there is no valid user session.
- Removed the Login component from `Layout` so it is not rendered on every page.
- Added working routes for dashboard, profile, students, training seasons, and import students.
- Added the missing `Profile.jsx` and `Notfound.jsx` pages.
- Login stores the returned token and then loads the user's profile before navigating to the dashboard.
- Logout clears the token and returns to `/login`.

The uploaded `node_modules` folder was intentionally excluded. Run `npm install` then `npm run dev`.
