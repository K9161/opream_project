
import { useState } from "react";
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
  const [showpassword, setShowpassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [language, setLanguage] = useState("AR");

  const isArabic = language === "AR";

  // Safe return URL
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

    return null;
  }

  // Update input values
  function getUserData(e) {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  // Validate login form
  function validateLoginForm() {
    const schema = Joi.object({
      email: Joi.string()
        .trim()
        .lowercase()
        .email({ tlds: { allow: false } })
        .max(100)
        .required()
        .messages({
          "string.empty": isArabic
            ? "البريد الإلكتروني مطلوب."
            : "Email is required.",

          "string.email": isArabic
            ? "يرجى إدخال بريد إلكتروني صحيح."
            : "Please enter a valid email.",

          "string.max": isArabic
            ? "البريد الإلكتروني يجب ألا يزيد عن 100 حرف."
            : "Email must not exceed 100 characters.",

          "any.required": isArabic
            ? "البريد الإلكتروني مطلوب."
            : "Email is required.",
        }),

      password: Joi.string()
        .min(8)
        .max(50)
        .pattern(/^(?=.*\p{L})(?=.*\d).+$/u)
        .required()
        .messages({
          "string.empty": isArabic
            ? "كلمة المرور مطلوبة."
            : "Password is required.",

          "string.min": isArabic
            ? "كلمة المرور يجب ألا تقل عن 8 أحرف."
            : "Password must be at least 8 characters.",

          "string.max": isArabic
            ? "كلمة المرور يجب ألا تزيد عن 50 حرفًا."
            : "Password must not exceed 50 characters.",

          "string.pattern.base": isArabic
            ? "كلمة المرور يجب أن تحتوي على حروف وأرقام."
            : "Password must contain letters and numbers.",

          "any.required": isArabic
            ? "كلمة المرور مطلوبة."
            : "Password is required.",
        }),
    });

    const validation = schema.validate(
      {
        email: user.email.trim(),
        password: user.password,
      },
      {
        abortEarly: false,
      }
    );

    const errors = (validation.error?.details || []).map((item) => ({
      message: item.message,
    }));

    return errors;
  }

  // Map API errors to user-friendly messages
  function getLoginError(err) {
    const apiData = err.response?.data;

    const apiMessage =
      typeof apiData === "string"
        ? apiData
        : [
            apiData?.message,
            apiData?.error,
            apiData?.code,
            apiData?.status,
          ]
            .filter(Boolean)
            .join(" ");

    const message = String(apiMessage || "").toLowerCase();
    const status = err.response?.status;

    let errorType = "invalid";

    if (!err.response) {
      errorType = "network";
    } else if (
      status === 423 ||
      status === 429 ||
      message.includes("locked") ||
      message.includes("too many attempts") ||
      message.includes("15 minutes") ||
      message.includes("15 minute")
    ) {
      errorType = "locked";
    } else if (
      message.includes("company account") &&
      (
        message.includes("inactive") ||
        message.includes("not active") ||
        message.includes("expired")
      )
    ) {
      errorType = "companyInactive";
    } else if (
      message.includes("suspended") ||
      message.includes("account disabled")
    ) {
      errorType = "suspended";
    } else if (
      message.includes("not active") ||
      message.includes("inactive") ||
      message.includes("not activated") ||
      message.includes("not verified")
    ) {
      errorType = "inactive";
    }

    const messages = {
      invalid: isArabic
        ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
        : "Invalid email or password.",

      inactive: isArabic
        ? "حسابك غير نشط حتى الآن. يرجى التواصل مع إدارة الكلية لتفعيله."
        : "Your account is not active yet. Please contact your college administration.",

      suspended: isArabic
        ? "تم إيقاف حسابك. يرجى التواصل مع مسؤول النظام."
        : "Your account has been suspended. Please contact the system administrator.",

      companyInactive: isArabic
        ? "حساب الشركة غير نشط. يرجى التواصل مع مسؤول النظام."
        : "Your company account is not active. Please contact the system administrator.",

      locked: isArabic
        ? "تم قفل الحساب مؤقتًا. يرجى المحاولة مرة أخرى بعد 15 دقيقة."
        : "Your account is locked. Please try again in 15 minutes.",

      network: isArabic
        ? "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى."
        : "Unable to connect to the server. Please check your internet connection.",
    };

    return messages[errorType];
  }

  // Redirect according to user role
  function getDashboardPath(loggedInUser) {
    const rawRole =
      loggedInUser?.user?.role ||
      loggedInUser?.role ||
      loggedInUser?.user?.user_type ||
      loggedInUser?.user_type ||
      loggedInUser?.user?.userType ||
      loggedInUser?.userType;
    const role = String(rawRole || "student").trim().toLowerCase().replace(/[\s-]+/g, "_");

    const roleRoutes = {
      student: "/internship",
      admin: "/students",
      college_admin: "/students",
      company: "/applications",
      company_admin: "/applications",
      mentor: "/exams",
    };

    return roleRoutes[role] || "/internship";
  }

  // Login API
  async function postDataToApi() {
    try {
      const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
      const { data } = await axios.post(
        `${apiBaseUrl}/api/auth/login`,
        {
          email: user.email.trim().toLowerCase(),
          password: user.password,
          remember_me: rememberMe,
        }
      );

      // Read tokens from the API response
      const responseData = data?.data || data;

      const accessToken = responseData?.access_token || responseData?.accessToken || responseData?.token;
      const refreshToken = responseData?.refresh_token || responseData?.refreshToken;

      if (!accessToken || !refreshToken) {
        setError([
          {
            message: isArabic
              ? "لم يتم استلام بيانات تسجيل الدخول كاملة من الخادم."
              : "The server did not return the required login tokens.",
          },
        ]);

        return;
      }

      // Save tokens
      // Keep userToken for compatibility with the existing app.
      localStorage.setItem("userToken", accessToken);
      sessionStorage.setItem("uip_access_token", accessToken);
      const apiUser = responseData?.user || data?.user;
      if (apiUser && typeof apiUser === "object") {
        localStorage.setItem("opream_user", JSON.stringify(apiUser));
      }

      // Remember Me controls the refresh-token lifetime on the backend.
      // Store the refresh token for the current browser session.
      sessionStorage.setItem("uip_refresh_token", refreshToken);

      if (rememberMe) {
        localStorage.setItem(
          "rememberedaccount",
          user.email.trim().toLowerCase()
        );
      } else {
        localStorage.removeItem("rememberedaccount");
      }

      if (typeof saveUserData !== "function") {
        localStorage.removeItem("userToken");
        localStorage.removeItem("opream_user");
        sessionStorage.removeItem("uip_access_token");
        sessionStorage.removeItem("uip_refresh_token");

        setError([
          {
            message: isArabic
              ? "تعذر تحميل بيانات المستخدم."
              : "User data loader is unavailable.",
          },
        ]);

        return;
      }

      // Load logged-in user information
      const loggedInUser = await saveUserData();

      if (loggedInUser) {
        const returnUrl = getSafeReturnUrl();

        navigate(
          returnUrl || getDashboardPath(loggedInUser),
          {
            replace: true,
          }
        );
      } else {
        localStorage.removeItem("userToken");
        localStorage.removeItem("opream_user");
        sessionStorage.removeItem("uip_access_token");
        sessionStorage.removeItem("uip_refresh_token");

        setError([
          {
            message: isArabic
              ? "تم تسجيل الدخول، ولكن تعذر تحميل بيانات الحساب."
              : "Login succeeded, but user data could not be loaded.",
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
          message: getLoginError(err),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Submit login form
  function submitLoginForm(event) {
    event.preventDefault();

    const validationErrors = validateLoginForm();

    if (validationErrors.length > 0) {
      setError(validationErrors);
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

      <main className="flex justify-center px-4 py-8 md:px-6 md:py-12">
        <section className="w-full max-w-[696px] rounded-[28px] border border-white/80 bg-white px-5 py-8 shadow-[0_24px_80px_-28px_rgba(30,64,175,0.22)] sm:px-8 md:px-[34px] md:py-10">

          {/* Portal Title */}
          <div className="mb-4 flex flex-col items-center text-center">
            <div className="mb-5 flex h-[75px] w-[106px] items-center justify-center rounded-[24px] border border-blue-100 bg-gradient-to-br from-[#f3f5ff] to-[#e9edff] text-[#083db9] shadow-sm">
              <Landmark size={30} />
            </div>

            <h2 className="text-2xl font-bold">
              {isArabic
                ? "تسجيل الدخول إلى البوابة"
                : "Sign In"}
            </h2>

            <p className="mt-4 max-w-md text-sm leading-5 text-gray-600">
              {isArabic
                ? "سجّل الدخول للوصول إلى خدمات البوابة حسب صلاحيات حسابك."
                : "Sign in to access portal services based on your account role."}
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
                {isArabic ? "تنبيه: " : "Notice: "}
              </strong>

              {isArabic
                ? "يتم إنشاء الحسابات وتفعيلها من خلال الجهة المسؤولة. لا يلزم التسجيل العام."
                : "Accounts are provisioned and activated by the responsible institution. No public registration is required."}
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
                {isArabic ? "البريد الإلكتروني" : "Email"}
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
                  maxLength={100}
                  value={user.email}
                  onChange={getUserData}
                  placeholder="name@university.edu"
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
                  type={showpassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={8}
                  maxLength={50}
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
                    setShowpassword((prev) => !prev)
                  }
                  aria-label={
                    showpassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="shrink-0 rounded-lg p-1 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                  {showpassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="group flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-slate-600 transition-colors hover:text-[#083db9]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="peer sr-only"
                />

                <span className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-slate-300 bg-white transition-all duration-200 group-hover:border-[#083db9] peer-checked:border-[#083db9] peer-checked:bg-[#083db9] peer-focus-visible:ring-4 peer-focus-visible:ring-blue-100">
                  {rememberMe && (
                    <svg
                      className="h-3.5 w-3.5 text-white"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        d="M4 10L8 14L16 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>

                {isArabic ? "تذكرني" : "Remember Me"}
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm font-semibold text-blue-700 underline-offset-4 transition-colors hover:text-blue-900 hover:underline"
              >
                {isArabic
                  ? "نسيت كلمة المرور؟"
                  : "Forgot password?"}
              </button>
            </div>

            {/* Error Messages */}
            {error.length > 0 && (
              <div
                role="alert"
                aria-live="polite"
                className="space-y-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 shadow-sm"
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
                !user.password
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
                ? "تحتاج إلى تفعيل حسابك؟ يرجى مراجعة بريدك الإلكتروني أو التواصل مع دعم البوابة:"
                : "Need account activation? Check your account or contact portal support:"}{" "}

              <a
                href="mailto:portal-support@university.edu"
                className="break-words font-semibold text-blue-700 underline-offset-4 hover:text-blue-900 hover:underline"
              >
                portal-support@university.edu
              </a>
            </p>
          </div>

          <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <LockKeyhole size={13} />
            {isArabic
              ? "قفل الحساب لمدة 15 دقيقة بعد 5 محاولات فاشلة متتالية."
              : "5 consecutive failed attempts lock account for 15 minutes."}
          </p>
        </section>
      </main>
    </div>
  );
}
