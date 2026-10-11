import React from "react";
import { Link } from "react-router-dom";

export default function Notfound() {
  return (
    <div className="text-center py-5">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="btn btn-primary">
        Back to Dashboard
      </Link>
    </div>
  );
}
