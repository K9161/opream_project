import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Joi from "joi";

export default function Login({ saveUserData }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Restore the page the user originally wanted, but only allow internal paths.
  function getSafeReturnUrl() {
    const returnUrl = searchParams.get("returnUrl");

    if (
      returnUrl &&
      returnUrl.startsWith("/") &&
      !returnUrl.startsWith("//") &&
      !returnUrl.startsWith("/\\")
    ) {
      return returnUrl;
    }

    return "/";
  }
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  function getUserData(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  function validateLoginForm() {
    const schema = Joi.object({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required()
        .messages({
          "string.empty": "Email is required",
          "string.email": "Please enter a valid email",
          "any.required": "Email is required",
        }),
      password: Joi.string()
        .min(6)
        .required()
        .messages({
          "string.empty": "Password is required",
          "string.min": "Password must be at least 6 characters",
          "any.required": "Password is required",
        }),
    });

    return schema.validate(user, { abortEarly: false });
  }

  async function postDataToApi() {
    try {
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        user
      );

      console.log("LOGIN RESPONSE:", data);

      const token =
        data?.data?.token ||
        data?.token ||
        data?.data?.accessToken ||
        data?.accessToken;

      if (!token) {
        setError([{ message: data?.message || "Token was not returned by the API" }]);
        return;
      }

      localStorage.setItem("userToken", token);

      const loggedInUser = await saveUserData();

      if (loggedInUser) {
        navigate(getSafeReturnUrl(), { replace: true });
      } else {
        setError([{ message: "Login succeeded, but user data could not be loaded." }]);
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);

      setError([
        {
          message:
            err.response?.data?.message ||
            "Email or password is incorrect.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function submitLoginForm(event) {
    event.preventDefault();

    const validation = validateLoginForm();

    if (validation.error) {
      setError(validation.error.details);
      return;
    }

    setError([]);
    setLoading(true);
    postDataToApi();
  }

  return (
    <div className="container py-5" >
      <h2 className="mb-4">Login</h2>

      {error.length > 0 && (
        <div className="alert alert-danger">
          {error.map((err, index) => (
            <div key={index}>{err.message}</div>
          ))}
        </div>
      )}

      <form onSubmit={submitLoginForm}>
        <label htmlFor="email">Email</label>
        <input
          onChange={getUserData}
          value={user.email}
          type="email"
          className="form-control my-2"
          name="email"
          id="email"
        />

        <label htmlFor="password">Password</label>
        <input
          onChange={getUserData}
          value={user.password}
          type="password"
          className="form-control my-2"
          name="password"
          id="password"
        />

        <button
          type="submit"
          className="btn btn-info w-100 mt-2"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
