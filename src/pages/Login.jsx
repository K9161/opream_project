import React, { useState } from "react";
import axios from "axios";
import Joi from "joi";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ShieldCheck,
  HelpCircle,
  Info,
  Landmark,
} from "lucide-react";

import image from "../assets/Logo.png";

export default function Login({ saveUserData }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [language, setLanguage] = useState("EN");

  const isArabic = language === "AR";

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

  function getUserData(e) {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  function validateLoginForm() {
    const schema = Joi.object({
      email: Joi.string()
        .email()
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
          "string.min":
            "Password must be at least 6 characters",
          "any.required": "Password is required",
        }),
    });

    const validation = schema.validate(user, {
      abortEarly: false,
    });

    const errors = validation.error?.details || [];

    if (!rememberMe) {
      errors.push({
        message: isArabic
          ? "يجب تفعيل خيار تذكرني قبل تسجيل الدخول."
          : "Please check Remember Me before logging in.",
      });
    }

    return errors;
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
        setError([
          {
            message:
              data?.message ||
              "Token was not returned by the API",
          },
        ]);
        return;
      }

      localStorage.setItem("userToken", token);

      // Store the email only, never the password.
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", user.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      if (typeof saveUserData !== "function") {
        setError([
          {
            message:
              "Login succeeded, but user data loader is unavailable.",
          },
        ]);
        return;
      }

      const loggedInUser = await saveUserData();

      if (loggedInUser) {
        navigate(getSafeReturnUrl(), {
          replace: true,
        });
      } else {
        localStorage.removeItem("userToken");

        setError([
          {
            message:
              "Login succeeded, but user data could not be loaded.",
          },
        ]);
      }
    } catch (err) {
      console.error(
        "LOGIN ERROR:",
        err.response?.data || err.message
      );

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

    const validationErrors = validateLoginForm();

    if (validationErrors.length > 0) {
      setError(
        validationErrors.map((err) => ({
          message: err.message,
        }))
      );
      return;
    }

    setError([]);
    setLoading(true);
    postDataToApi();
  }

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-[#f4f7ff] via-[#faf8ff] to-[#eef7ff] text-[#182238]"
    >
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100/80 bg-white/95 px-5 py-3 shadow-sm backdrop-blur-md md:min-h-[86px] md:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b4bd4] to-[#062d91] shadow-md shadow-blue-900/20 ring-4 ring-blue-50">
            <img
              src={image}
              alt="Opream Web"
              className="h-full w-full object-contain"
            />
          </div>

          <span className="ml-8 hidden rounded-full border border-teal-100 bg-gradient-to-r from-[#d9fbf7] to-[#b5f4ef] px-7 py-2 font-semibold tracking-wide text-teal-800 shadow-sm lg:inline-block">
            Institutional
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-600 lg:flex">
            <ShieldCheck
              size={32}
              className="text-teal-700"
            />
            Authorized Academic Environment
          </div>

          <div className="flex rounded-2xl border border-[#d9dcef] bg-[#f2f3ff] p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setLanguage("EN")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                !isArabic
                  ? "bg-white text-blue-700"
                  : "text-gray-700"
              }`}
            >
              EN
            </button>

            <button
              type="button"
              onClick={() => setLanguage("AR")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isArabic
                  ? "bg-white text-blue-700"
                  : "text-gray-700"
              }`}
            >
              العربية
            </button>
          </div>
        </div>
      </header>

      {/* Login Card */}
      <main className="flex justify-center px-4 py-8 md:px-6 md:py-12">
        <section className="w-full max-w-[696px] rounded-[28px] border border-white/80 bg-white px-5 py-8 shadow-[0_24px_80px_-28px_rgba(30,64,175,0.22)] sm:px-8 md:px-[34px] md:py-10">
          {/* Title */}
          <div className="mb-4 flex flex-col items-center text-center">
            <div className="mb-5 flex h-[75px] w-[106px] items-center justify-center rounded-[24px] border border-blue-100 bg-gradient-to-br from-[#f3f5ff] to-[#e9edff] text-[#083db9] shadow-sm">
              <Landmark size={30} />
            </div>

            <h2 className="text-2xl font-bold">
              {isArabic
                ? "تسجيل دخول الطالب"
                : "Student Portal Sign In"}
            </h2>

            <p className="mt-4 max-w-md text-sm leading-5 text-gray-600">
              {isArabic
                ? "تابع أماكن التدريب وسجلات المشرفين وإجراءات التخرج."
                : "Access verified placements, supervisor logs, and graduation clearances"}
            </p>
          </div>

          {/* University Notice */}
          <div className="mb-7 flex items-center gap-4 rounded-2xl border border-blue-100/80 bg-gradient-to-r from-[#f4f5ff] to-[#f0f4ff] p-5 shadow-sm shadow-blue-900/[0.03]">
            <Info
              size={26}
              className="shrink-0 text-blue-700"
            />

            <p className="text-base leading-6 text-gray-600 sm:text-lg">
              <strong className="text-[#182238]">
                {isArabic
                  ? "تنبيه الجامعة: "
                  : "University Notice: "}
              </strong>

              {isArabic
                ? "يتم إنشاء حسابات الطلاب وتفعيلها من خلال الكلية. لا يلزم التسجيل العام."
                : "Student accounts are provisioned and activated by your faculty office. No public registration is required."}
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={submitLoginForm}
            className="space-y-6"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-3 block text-sm font-semibold tracking-wide text-slate-700"
              >
                {isArabic
                  ? "البريد الإلكتروني الجامعي"
                  : "Academic Email"}
              </label>

              <div className="flex h-16 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm shadow-slate-900/[0.02] transition-all duration-200 hover:border-slate-300 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100/80">
                <Mail
                  size={20}
                  className="shrink-0 text-gray-500"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={user.email}
                  onChange={getUserData}
                  placeholder="student.id@university.edu"
                  className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-3 block text-sm font-semibold tracking-wide text-slate-700"
              >
                {isArabic ? "كلمة المرور" : "Password"}
              </label>

              <div className="flex h-16 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm shadow-slate-900/[0.02] transition-all duration-200 hover:border-slate-300 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100/80">
                <LockKeyhole
                  size={20}
                  className="shrink-0 text-gray-500"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={user.password}
                  onChange={getUserData}
                  placeholder={
                    isArabic
                      ? "أدخل كلمة المرور"
                      : "Enter your password"
                  }
                  className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="shrink-0 rounded-lg p-1 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-600 transition-colors hover:text-blue-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="h-11 w-11 cursor-pointer accent-[#083db9]"
                />

                {isArabic ? "تتذكرني" : "Remember Me"}
              </label>

              <button
                type="button"
                onClick={() =>
                  setError([
                    {
                      message: isArabic
                        ? "تواصل مع دعم البوابة لاستعادة كلمة المرور."
                        : "Please contact portal support to reset your password.",
                    },
                  ])
                }
                className="text-sm font-semibold text-blue-700 underline-offset-4 transition-colors hover:text-blue-900 hover:underline"
              >
                {isArabic
                  ? "نسيت كلمة المرور؟"
                  : "Forgot Password?"}
              </button>
            </div>

            {/* Error Messages */}
            {error.length > 0 && (
              <div
                role="alert"
                className="space-y-1 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm"
              >
                {error.map((err, index) => (
                  <p key={index}>
                    {err.message}
                  </p>
                ))}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={
                loading ||
                !user.email.trim() ||
                !user.password ||
                !rememberMe
              }
              className="h-[69px] w-full rounded-2xl bg-gradient-to-r from-[#0a43c5] to-[#0736a6] text-xl font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#083bb4] hover:to-[#052d8e] hover:shadow-xl hover:shadow-blue-900/25 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading
                ? isArabic
                  ? "جارٍ تسجيل الدخول..."
                  : "Loading..."
                : isArabic
                  ? "تسجيل الدخول"
                  : "Login"}
            </button>
          </form>

          {/* Account Activation */}
          <div className="mt-9 flex items-center gap-3 rounded-2xl border border-teal-100/80 bg-gradient-to-r from-[#f3f5ff] to-[#effaf9] p-5 shadow-sm sm:p-6">
            <HelpCircle
              size={26}
              className="shrink-0 text-teal-700"
            />

            <p className="text-base leading-6 text-gray-600 sm:text-lg">
              {isArabic
                ? "لتفعيل حسابك، راجعي بريد الجامعة أو تواصلي مع الدعم:"
                : "Need account activation? Check your university inbox for the activation link or contact"}{" "}

              <a
                href="mailto:portal-support@university.edu"
                className="break-words font-semibold text-blue-700 underline-offset-4 hover:text-blue-900 hover:underline"
              >
                portal-support@university.edu
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}