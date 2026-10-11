import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout({ userData, logOut }) {
  return (
    <>
      <Navbar userData={userData} logOut={logOut} />
      <main className="container py-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
