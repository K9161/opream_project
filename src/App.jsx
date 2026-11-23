
import { useCallback, useEffect, useState } from "react";
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
import Exams from "./pages/Exams";
import Applications from "./pages/Applications";
import Notifications from "./pages/Notifications";
import Internship from "./pages/internship";
import InternshipDetails from "./pages/InternshipDetails";
import ApplyInternship from "./pages/ApplyInternship";
import ExamTaking from "./pages/ExamTaking";
import Students from "./pages/Students";
import TrainingSeasons from "./pages/TrainingSeasons";
import ImportStudents from "./pages/ImportStudents";
import Notfound from "./pages/Notfound";
import "./index.css";
import { I18nProvider } from "./i18n";
import Statesuccess from "./pages/Forgetpassword/Statesuccess";
import ResetPassword from "./pages/Forgetpassword/Resetpassword";
import ForgotPassword from "./pages/Forgetpassword/ForgotPassword";

export default function App() {
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const saveUserData = useCallback(async function saveUserData() {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setUserData(null);
      setAuthLoading(false);
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
        throw new Error("Session expired");
      }

      let profile = decoded;
      try {
        const savedProfile = localStorage.getItem("opream_user");
        if (savedProfile) profile = JSON.parse(savedProfile);
      } catch {
        localStorage.removeItem("opream_user");
      }

      setUserData(profile);
      setAuthLoading(false);
      return profile;
    } catch (error) {
      if (import.meta.env.DEV) console.warn("SESSION ERROR:", error.message);
      localStorage.removeItem("userToken");
      sessionStorage.removeItem("uip_access_token");
      sessionStorage.removeItem("uip_refresh_token");
      localStorage.removeItem("opream_user");
      setUserData(null);
      setAuthLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    saveUserData();
  }, [saveUserData]);

  function logOut() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("opream_user");
    sessionStorage.removeItem("uip_access_token");
    sessionStorage.removeItem("uip_refresh_token");
    setUserData(null);
    window.location.href = "/login";
  }

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login saveUserData={saveUserData} />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/Statesuccess",
      element: <Statesuccess />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/",
      element: <Layout userData={userData} logOut={logOut} />,
      children: [
        {
          index: true,
          element: <Navigate to="/internship" replace />,
        },
        {
          path: "internship",
          element: (
            <ProtectedRoute userData={userData} loading={authLoading}>
              <Internship />
            </ProtectedRoute>
          ),
        },
        {
          path: "internship/:id",
          element: (
            <ProtectedRoute userData={userData} loading={authLoading}>
              <InternshipDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "internship/:id/apply",
          element: (
            <ProtectedRoute userData={userData} loading={authLoading}>
              <ApplyInternship />
            </ProtectedRoute>
          ),
        },
        {
          path: "exams/:id/take",
          element: (
            <ProtectedRoute userData={userData} loading={authLoading}>
              <ExamTaking />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute userData={userData} loading={authLoading}>
              <Profile userData={userData} />
            </ProtectedRoute>
          ),
        },
        {
          path: "exams",
          element: (
            <ProtectedRoute userData={userData} loading={authLoading}>
              <Exams />
            </ProtectedRoute>
          ),
        },
        {
          path: "applications",
          element: (
            <ProtectedRoute userData={userData} loading={authLoading}>
              <Applications />
            </ProtectedRoute>
          ),
        },
        {
          path: "notifications",
          element: (
            <ProtectedRoute userData={userData} loading={authLoading}>
              <Notifications />
            </ProtectedRoute>
          ),
        },
        {
          path: "students",
          element: (
            <ProtectedRoute userData={userData} loading={authLoading}>
              <Students />
            </ProtectedRoute>
          ),
        },
        {
          path: "training-seasons",
          element: (
            <ProtectedRoute userData={userData} loading={authLoading}>
              <TrainingSeasons />
            </ProtectedRoute>
          ),
        },
        {
          path: "import-students",
          element: (
            <ProtectedRoute userData={userData} loading={authLoading}>
              <ImportStudents />
            </ProtectedRoute>
          ),
        },
        {
          path: "*",
          element: (
            <ProtectedRoute userData={userData} loading={authLoading}>
              <Notfound />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  );
}
