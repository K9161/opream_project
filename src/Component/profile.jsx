import { useState } from "react";
import { Building2, CalendarDays, Check, FileUp, KeyRound, Phone, Mail, Save, ShieldCheck } from "lucide-react";
import { useI18n } from "../i18n";
import avatar from "../assets/profile.png";
import ConfirmModal from "./ConfirmModal";

const DEFAULT_STUDENT = {
  studentId: "STD-2024-91048",
  gpa: 3.94,
  maxGpa: 4.0,
};

const STEPS = [
  { key: "submitted", name: "submittedStep", done: "verified", current: "inProgress", upcoming: "inProgress" },
  { key: "screening", name: "screeningStep", done: "approved", current: "inProgress", upcoming: "inProgress" },
  { key: "exam", name: "examStep", done: "completed", current: "inProgress", upcoming: "inProgress" },
  { key: "results", name: "examResultsStep", done: "approved", current: "inProgress", upcoming: "upcoming" },
  { key: "approval", name: "stepApproval", done: "approved", current: "inProgress", upcoming: "upcoming" },
  { key: "active", name: "activeStep", done: "completed", current: "inProgress", upcoming: "upcoming" },
];

const INTERNSHIPS = [
  { id: 1, title: "internshipFrontend", currentStep: 3 },
  { id: 2, title: "internshipBackend", currentStep: 5 },
];

function StepCard({ index, step, state, t }) {
  const styles = {
    done: "bg-sky-100 text-emerald-800",
    current: "bg-blue-800 text-white shadow-md",
    upcoming: "bg-sky-100/60 text-slate-400",
  }[state];

  const subLabel = t(step[state === "done" ? "done" : state === "current" ? "current" : "upcoming"]);

  return (
    <div className={`flex min-h-[64px] items-center gap-3 rounded-xl px-4 py-3 ${styles}`}>
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
        state === "done"
          ? "bg-emerald-800 text-white"
          : state === "current"
          ? "bg-white text-blue-800"
          : "border border-slate-300 bg-white text-slate-400"
      }`}>
        {state === "done" ? <Check size={13} strokeWidth={3} /> : index + 1}
      </span>
      <span className="min-w-0 text-xs leading-snug">
        <span className={`block ${state === "done" ? "font-medium text-slate-700" : state === "current" ? "font-medium" : ""}`}>
          {t(step.name)}
        </span>
        <span className="block font-semibold">{subLabel}</span>
      </span>
    </div>
  );
}

function Field({ label, value, wide = false }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p className="mb-1.5 text-[11px] font-medium text-slate-700">{label}</p>
      <div className="rounded-lg bg-[#eef2ff] px-3 py-3 text-xs font-semibold text-slate-800">{value}</div>
    </div>
  );
}

export default function Profile({ userData }) {
  const { t, language, setLanguage } = useI18n();

  const user = userData?.user || userData || {};
  const displayName = user.name || user.username || t("student");

  const student = {
    ...DEFAULT_STUDENT,
    ...(user.studentId ? { studentId: user.studentId } : {}),
    ...(user.gpa ? { gpa: user.gpa } : {}),
  };

  const [phone, setPhone] = useState("+20 01156780896");
  const [email, setEmail] = useState("alaamagdy@nub.edu.eg");
  const [notifPrefs, setNotifPrefs] = useState({ exams: true, applications: true });
  const [consent, setConsent] = useState(true);
  const [saved, setSaved] = useState(false);
  const [cvName, setCvName] = useState("Alaa_Magdy_CV.pdf");
  const [withdrawId, setWithdrawId] = useState(null);
  const [withdrawn, setWithdrawn] = useState([]);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  function withdrawApplication() {
    if (withdrawId === null) return;
    try {
      const saved = JSON.parse(localStorage.getItem("opreamApplications") || "[]");
      const remaining = (Array.isArray(saved) ? saved : []).filter((app) => String(app.internshipId) !== String(withdrawId));
      localStorage.setItem("opreamApplications", JSON.stringify(remaining));
    } catch {
      localStorage.removeItem("opreamApplications");
    }
    setWithdrawn((previous) => [...previous, withdrawId]);
    setWithdrawId(null);
  }

  function savePreferences() {
    localStorage.setItem("opream_preferences", JSON.stringify({ language, phone, email, notifPrefs, consent, cvName }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Student card */}
      <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <img src={avatar} alt={displayName} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">{displayName}</h1>
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">{t("registrarVerified")}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-700">{student.studentId} • {t("faculty")}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-slate-500">
              <span className="flex items-center gap-2"><Building2 size={15} />{t("mainCampus")}</span>
              <span className="flex items-center gap-2"><CalendarDays size={15} />{t("admitted")}</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-indigo-200 bg-indigo-100/70 px-8 py-4 text-center md:min-w-[200px]">
          <p className="text-sm font-medium text-slate-700">{t("gpa")}</p>
          <p className="mt-2 flex items-baseline justify-center gap-2">
            <span className="text-2xl font-bold text-blue-700">{Number(student.gpa).toFixed(2)}</span>
            <span className="text-xs font-semibold text-slate-600">/ {Number(student.maxGpa).toFixed(1)}</span>
          </p>
        </div>
      </section>

      {/* Internship progress */}
      {INTERNSHIPS.filter((internship) => !withdrawn.includes(internship.id)).map((internship) => (
        <section key={internship.id} className="rounded-2xl border border-slate-300 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-slate-900">{internship.id}</span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{t(internship.title)}</h2>
                <p className="mt-1 text-sm text-slate-700">{t("progressStatus")}</p>
              </div>
            </div>
            <button type="button" onClick={() => setWithdrawId(internship.id)} className="rounded-lg bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-800">{t("withdrawApplication")}</button>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {STEPS.map((step, i) => {
              const n = i + 1;
              const state = n < internship.currentStep ? "done" : n === internship.currentStep ? "current" : "upcoming";
              return <StepCard key={step.key} index={i} step={step} state={state} t={t} />;
            })}
          </div>
        </section>
      ))}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Academic Profile */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800"><ShieldCheck size={18} className="text-blue-700"/>{t("academicProfile")}</h2>
            <span className="text-[11px] font-medium text-slate-500">{t("officialRecord")}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("fullLegalName")} value="Alaa Magdy" />
            <Field label={t("studentUniversityId")} value={student.studentId} />
            <Field label={t("college")} value={t("sampleCollege")} wide />
            <Field label={t("degreeMajor")} value="Computer Science" />
            <Field label={t("currentStanding")} value={t("seniorYear4")} />
            <div className="rounded-lg bg-[#eef2ff] px-3 py-3 sm:col-span-2">
              <p className="mb-1.5 text-[11px] font-medium text-slate-700">{t("gpaScale")}</p>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-blue-700">{Number(student.gpa).toFixed(2)} / 4.0 ({t("deansHonorList")})</span>
                <span className="rounded-full bg-teal-100 px-3 py-1 text-[10px] font-semibold text-teal-800">{t("eligiblePlacement")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800"><ShieldCheck size={18} className="text-blue-700"/>{t("preferences")}</h2>
            <span className="text-[11px] font-medium text-slate-500">{t("userEditable")}</span>
          </div>

          <p className="mb-2 text-xs font-semibold text-slate-800">{t("preferredLanguage")}</p>
          <p className="mb-3 text-[11px] text-slate-500">{t("languageHelp")}</p>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            {[{ value: "en", label: t("englishLtr"), hint: t("defaultInterface") }, { value: "ar", label: t("arabicRtl"), hint: t("arabicLocalization") }].map((option) => (
              <button key={option.value} type="button" onClick={() => setLanguage(option.value)} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-start transition ${language === option.value ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${language === option.value ? "border-blue-700" : "border-slate-400"}`}>{language === option.value && <span className="h-2 w-2 rounded-full bg-blue-700" />}</span>
                <span><span className="block text-xs font-semibold text-slate-800">{option.label}</span><span className="block text-[10px] text-slate-500">{option.hint}</span></span>
              </button>
            ))}
          </div>

          <p className="mb-2 text-xs font-semibold text-slate-800">{t("notificationPreferences")}</p>
          <div className="mb-4 flex flex-wrap gap-4 text-xs text-slate-700">
            {[["exams", t("examReminders")], ["applications", t("applicationUpdates")]].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2"><input type="checkbox" checked={notifPrefs[key]} onChange={(e) => setNotifPrefs((p) => ({ ...p, [key]: e.target.checked }))} className="h-4 w-4 accent-blue-700" />{label}</label>
            ))}
          </div>

          <label className="mb-1 block text-xs font-semibold text-slate-800">{t("contactPhone")}</label>
          <p className="mb-2 text-[11px] text-slate-500">{t("contactPhoneHelp")}</p>
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5"><Phone size={15} className="text-slate-500" /><input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-transparent text-xs outline-none" /></div>

          <label className="mb-2 block text-xs font-semibold text-slate-800">{t("institutionalEmail")}</label>
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5"><Mail size={15} className="text-slate-500" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent text-xs outline-none" /></div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-800"><FileUp size={15} className="text-blue-700"/>{t("cvManagement")}</p>
              <p className="mb-2 truncate text-[11px] text-slate-500">{cvName}</p>
              <label className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-50">{t("cvUpload")}<input type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => e.target.files?.[0] && setCvName(e.target.files[0].name)} /></label>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-800"><KeyRound size={15} className="text-blue-700"/>{t("changePassword")}</p>
              <button type="button" onClick={() => setPasswordOpen(true)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-50">{t("changePassword")}</button>
            </div>
          </div>

          <label className="mb-4 flex items-start gap-2 text-[11px] leading-5 text-slate-700"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-blue-700" />{t("firstLoginConsentBody")}</label>

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
            {saved && <span className="text-xs font-semibold text-teal-700">{t("changesSaved")}</span>}
            <button type="button" onClick={savePreferences} className="flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-800"><Save size={14} />{t("saveChanges")}</button>
          </div>
        </section>
      </div>

      <ConfirmModal
        open={withdrawId !== null}
        title={t("withdrawConfirm")}
        body={t("withdrawWarning")}
        confirmLabel={t("withdrawApplication")}
        danger
        onCancel={() => setWithdrawId(null)}
        onConfirm={withdrawApplication}
      />
      <ConfirmModal
        open={passwordOpen}
        title={t("changePassword")}
        confirmLabel={t("saveChanges")}
        onCancel={() => setPasswordOpen(false)}
        onConfirm={() => { setPasswordOpen(false); setNewPassword(""); }}
      >
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t("newPassword")} className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-blue-500" />
      </ConfirmModal>
    </div>
  );
}
