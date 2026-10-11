import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ userData, children }) {
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
