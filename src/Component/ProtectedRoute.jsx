import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ userData, children }) {
  const location = useLocation();

  if (!userData) {
    const returnUrl = `${location.pathname}${location.search}${location.hash}`;

    return (
      <Navigate
        to={`/Login?returnUrl=${encodeURIComponent(returnUrl)}`}
        replace
      />
    );
  }

  return children;
}
