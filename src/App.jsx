import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import Layout from "./Component/Layout";
import Login from "./pages/Login";
import ProtectedRoute from "./Component/ProtectedRoute";
import Profile from "./Component/profile";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import TrainingSeasons from "./pages/TrainingSeasons";
import ImportStudents from "./pages/ImportStudents";
import Notfound from "./pages/Notfound";
import "./index.css";
export default function App() {
  const [userData, setUserData] = useState(null);

  async function saveUserData() {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setUserData(null);
      return null;
    }

    try {
     
      jwtDecode(token);

      const { data } = await axios.get(
        "https://route-posts.routemisr.com/users/profile-data",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData(data.data);
      return data.data;
    } catch (error) {
      console.log("PROFILE ERROR:", error.response?.data || error.message);
      localStorage.removeItem("userToken");
      setUserData(null);
      return null;
    }
  }

  useEffect(() => {
    saveUserData();
  }, []);

  function logOut() {
    localStorage.removeItem("userToken");
    setUserData(null);
   Navigate("/login") ;
  }

  const router = createBrowserRouter([
    {
      path: "/Login",
      element: <Login saveUserData={saveUserData} />,
    },
    {
      path: "/",
      element: <Layout userData={userData} logOut={logOut} />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute userData={userData}>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "dashboard",
          element: (
            <ProtectedRoute userData={userData}>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute userData={userData}>
              <Profile userData={userData} />
            </ProtectedRoute>
          ),
        },
        {
          path: "students",
          element: (
            <ProtectedRoute userData={userData}>
              <Students />
            </ProtectedRoute>
          ),
        },
        {
          path: "training-seasons",
          element: (
            <ProtectedRoute userData={userData}>
              <TrainingSeasons />
            </ProtectedRoute>
          ),
        },
        {
          path: "import-students",
          element: (
            <ProtectedRoute userData={userData}>
              <ImportStudents />
            </ProtectedRoute>
          ),
        },
        {
          path: "*",
          element: (
            <ProtectedRoute userData={userData}>
              <Notfound />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
