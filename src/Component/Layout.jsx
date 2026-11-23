import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import StudentSidebar from "./Sidebar";
import { Bell, ChevronRight } from "lucide-react";

import { useI18n } from "../i18n";
import ConfirmModal from "./ConfirmModal";
export default function Layout({ userData, logOut }) {
  const { language, setLanguage, t } = useI18n();
  const { pathname } = useLocation();
  const [consentDismissed, setConsentDismissed] = useState(false);
  const consentOpen = Boolean(userData && !consentDismissed && !localStorage.getItem("opream_privacy_consent"));

  const isDetails = /^\/internship\/[^/]+$/.test(pathname);
  const isApply = /^\/internship\/[^/]+\/apply$/.test(pathname);
  const isInternshipFlow = isDetails || isApply;
  const userName = userData?.firstName || userData?.name || t("student");

  const pageTitle = isInternshipFlow ? (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
      <Link to="/internship" className="font-medium text-slate-500 no-underline transition hover:text-blue-700">
        {t("internships")}
      </Link>
      <ChevronRight size={14} className="shrink-0 text-slate-300 rtl:rotate-180" />
      {isApply ? (
        <>
          <Link to={pathname.replace(/\/apply$/, "")} className="font-semibold text-slate-700 no-underline hover:text-blue-700">
            {t("title")}
          </Link>
          <ChevronRight size={14} className="shrink-0 text-slate-300 rtl:rotate-180" />
          <span className="font-semibold text-blue-700">{t("apply")}</span>
        </>
        
      ) : (
        <span className="font-semibold text-slate-800">{t("title")}</span>
      )}
    </nav>
  ) : pathname.startsWith("/profile") ? (
    t("profileSettings")
  ) : /^\/exams\/[^/]+\/take$/.test(pathname) ? (
    t("examPortal")
  ) : pathname.startsWith("/exams") ? (
    <span className="flex items-center gap-2">
      <span className="text-slate-800">{t("exams")}</span>
      <ChevronRight size={13} className="text-slate-400 rtl:rotate-180" />
      <span className="font-normal text-slate-500">{t("examsSubtitle")}</span>
    </span>
  ) : (
    t("internships")
  );

  return (
    <div className="min-h-screen bg-[#faf9ff] text-slate-800" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="flex min-h-screen">
        <StudentSidebar logOut={logOut} />
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex min-h-[68px] flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white/95 px-5 py-3 shadow-[0_2px_10px_rgba(15,23,42,0.025)] backdrop-blur sm:px-8">
            <div className="min-w-0 text-sm font-semibold text-slate-700">{pageTitle}</div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1" aria-label={t("language")}>
                <button onClick={() => setLanguage("en")} aria-pressed={language === "en"} className={`rounded-lg px-3 py-1.5 text-xs transition ${language === "en" ? "bg-white font-semibold text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>EN</button>
                <button onClick={() => setLanguage("ar")} aria-pressed={language === "ar"} className={`rounded-lg px-3 py-1.5 text-xs transition ${language === "ar" ? "bg-white font-semibold text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>العربية</button>
              </div>
              <Link to="/notifications" aria-label={t("notifications")} className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"><Bell size={17} /></Link>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">{String(userName).slice(0, 2).toUpperCase()}</span>
              <span className="hidden text-xs font-semibold text-slate-700 sm:inline">{userName}</span>
            </div>
          </header>
          <main className="px-3 py-5 sm:px-5 sm:py-6 lg:px-7 lg:py-7"><Outlet /></main>
        </div>
      </div>

      <ConfirmModal
        open={consentOpen}
        title={t("firstLoginConsentTitle")}
        body={t("firstLoginConsentBody")}
        confirmLabel={t("iAgree")}
        onCancel={() => setConsentDismissed(true)}
        onConfirm={() => { localStorage.setItem("opream_privacy_consent", "true"); setConsentDismissed(true); }}
      />
    </div>
  );
}
