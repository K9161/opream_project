import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ userData, logOut }) {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Dashboard
        </Link>

        <div className="d-flex align-items-center gap-3">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
          <Link className="nav-link" to="/students">
            Students
          </Link>
          <Link className="nav-link" to="/training-seasons">
            Training Seasons
          </Link>
          <Link className="nav-link" to="/import-students">
            Import Students
          </Link>
          <Link className="nav-link" to="/profile">
            Profile
          </Link>

          {userData && (
            <button className="btn btn-outline-danger btn-sm" onClick={logOut}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
