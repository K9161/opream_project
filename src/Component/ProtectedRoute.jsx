import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ userData, loading = false, children }) {
  const location = useLocation();

  // TEMPORARY PREVIEW: Skip login while developing or checking the UI.
  // Remove this block before deploying the project to production.
  if (import.meta.env.DEV) {
    return children;
  }

  // Wait for the saved session to be checked before redirecting.
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" role="status">
        <p className="text-sm text-slate-500">Loading your session...</p>
      </div>
    );
  }

  if (!userData) {
    const returnUrl = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
  }

  return children;
}
