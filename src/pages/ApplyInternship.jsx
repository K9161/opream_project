import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarClock, CheckCircle2, CloudUpload, FilePenLine, GraduationCap, Laptop, MapPin, ShieldCheck } from "lucide-react";
import { useI18n } from "../i18n";
import ConfirmModal from "../Component/ConfirmModal";

export default function ApplyInternship() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const isAr = language === "ar";
  const fileInputRef = useRef(null);

  const [track, setTrack] = useState("webTrack");
  const [statement, setStatement] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  function handleCv(file) {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError(t("cvWrongType"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t("cvTooLarge"));
      return;
    }
    setError("");
    setCvFile({ name: file.name, size: file.size });
  }

  function requestSubmit(event) {
    event.preventDefault();
    if (!statement.trim() || !accepted || !cvFile) {
      setError(t("requiredField"));
      return;
    }
    let existing;
    try {
      const savedApplications = JSON.parse(localStorage.getItem("opreamApplications") || "[]");
      existing = Array.isArray(savedApplications) ? savedApplications : [];
    } catch {
      existing = [];
    }
    if (existing.some((item) => item && String(item.internshipId) === String(id))) {
      setError(t("alreadyApplied"));
      return;
    }
    setError("");
    setConfirmOpen(true);
  }

  function submitApplication() {
    const application = {
      internshipId: id,
      title: t("title"),
      organization: t("organization"),
      shortName: "ITI",
      location: t("cairo"),
      track: t(track),
      statement: statement.trim(),
      cv: cvFile.name,
      department: "CS",
      submittedAt: new Date().toISOString(),
      status: "submitted",
    };
    let existing;
    try {
      const savedApplications = JSON.parse(localStorage.getItem("opreamApplications") || "[]");
      existing = Array.isArray(savedApplications) ? savedApplications : [];
    } catch {
      existing = [];
    }
    localStorage.setItem("opreamApplications", JSON.stringify([...existing, application]));
    setConfirmOpen(false);
    setSubmitted(true);
  }

  if (submitted) {
    return <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={32}/></span>
      <h1 className="text-xl font-bold text-slate-900">{t("applicationSent")}</h1>
      <p className="mt-2 text-sm text-slate-500">{t("applicationSentDesc")}</p>
      <button onClick={() => navigate("/internship")} className="mt-6 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800">{t("backToInternships")}</button>
    </div>;
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5">
      <Link to={`/internship/${id}`} className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 no-underline hover:text-blue-700"><ArrowLeft size={14} className={isAr ? "rotate-180" : ""}/>{t("backToDetails")}</Link>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Laptop size={24}/></span>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-teal-100 px-4 py-1.5 text-[10px] font-semibold text-teal-800"><BadgeCheck size={12} className="me-1 inline"/>{t("verifiedPartner")}</span><span className="text-xs text-slate-600">Term: {isAr ? "صيف 2026" : "Summer 2026"}</span></div>
            <h1 className="text-sm font-semibold text-slate-900">{t("applyFor")}</h1>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-500"><span className="flex items-center gap-1"><MapPin size={12}/>{isAr ? "سمارت فيليدج، الجيزة" : "Smart Village, Cairo"}</span><span className="flex items-center gap-1"><CalendarClock size={12}/>{t("fullTime")}</span></div>
          </div>
          <div className="border-t border-slate-200 pt-3 sm:border-s sm:border-t-0 sm:ps-5 sm:pt-0"><p className="text-[10px] text-slate-500">{t("deadline")}</p><p className="mt-1 text-sm font-bold text-rose-700">{isAr ? "30 يونيو 2026" : "June 30, 2026"}</p><p className="mt-1 text-[10px] text-slate-500">{isAr ? "12 يومًا متبقيًا" : "12 days remaining"}</p></div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3"><h2 className="flex items-center gap-2 text-sm font-bold text-slate-800"><GraduationCap size={19} className="text-blue-700"/>{t("academicRecord")}</h2><span className="rounded-full bg-teal-100 px-4 py-1.5 text-[10px] font-semibold text-teal-800"><ShieldCheck size={12} className="me-1 inline"/>{t("sisSynced")}</span></div>
        <p className="mb-4 text-xs text-slate-600">{t("retrievedInfo")}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <ReadOnlyField label={t("studentName")} value="Alaa Magdy"/>
          <ReadOnlyField label={t("academicId")} value="STD-2024-91048"/>
          <ReadOnlyField label={t("currentGpa")} value="3.94 / 4.00"/>
          <div className="sm:col-span-2"><ReadOnlyField label={t("college")} value={t("sampleCollege")}/></div>
          <ReadOnlyField label={t("department")} value="CS"/>
        </div>
      </div>

      <form onSubmit={requestSubmit} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="mb-5 flex items-center gap-2 border-b border-slate-200 pb-3 text-sm font-bold text-slate-800"><FilePenLine size={18} className="text-blue-700"/>{t("candidateSubmissions")}</h2>
        <label className="mb-2 block text-xs font-semibold text-slate-800" htmlFor="academic-track">{t("trackPreference")} <span className="text-rose-600">*</span></label>
        <select id="academic-track" value={track} onChange={e => setTrack(e.target.value)} className="mb-2 w-full rounded-lg border border-slate-200 bg-[#e0f1fa] px-3 py-3 text-xs text-slate-800 outline-none focus:border-blue-500 sm:max-w-2xl">
          <option value="webTrack">{t("webTrack")}</option><option value="mobileTrack">{t("mobileTrack")}</option><option value="dataTrack">{t("dataTrack")}</option>
        </select>
        <p className="mb-6 text-[11px] text-slate-500">{t("trackHelp")}</p>

        <p className="mb-2 text-xs font-semibold text-slate-800">{t("cvUpload")} <span className="text-rose-600">*</span></p>
        <div
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); handleCv(event.dataTransfer.files?.[0]); }}
          onClick={() => fileInputRef.current?.click()}
          className={`mb-6 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${dragging ? "border-blue-500 bg-blue-50" : "border-blue-200 bg-[#eef7fc] hover:border-blue-400"}`}
        >
          <CloudUpload size={34} className="text-slate-700"/>
          <p className="text-sm font-semibold text-slate-800">{cvFile ? `${t("cvSelected")}: ${cvFile.name}` : t("cvUploadHelp")}</p>
          <p className="text-[11px] text-slate-500">{t("cvFormats")}</p>
          <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => handleCv(event.target.files?.[0])} />
        </div>

        <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><label htmlFor="personal-statement" className="text-xs font-semibold text-slate-800">{t("personalStatement")} <span className="text-rose-600">*</span></label><span className={`text-[10px] ${statement.length > 900 ? "text-rose-600" : "text-slate-500"}`}>{statement.length} / 1000 {isAr ? "حرف" : "characters"}</span></div>
        <textarea id="personal-statement" value={statement} onChange={e => setStatement(e.target.value.slice(0, 1000))} rows={5} maxLength={1000} placeholder={t("statementPlaceholder")} className="w-full resize-y rounded-lg border border-slate-200 bg-[#eef7fc] px-3 py-3 text-xs leading-6 text-slate-800 outline-none placeholder:text-slate-500 focus:border-blue-400"/>
        <p className="mt-3 flex items-start gap-2 text-[11px] text-slate-600"><span className="mt-0.5 text-slate-500">ⓘ</span>{t("evaluatedBy")}</p>
        <p className="mt-2 flex items-start gap-2 text-[11px] font-medium text-slate-700"><span className="mt-0.5 text-blue-700">ⓘ</span>{t("screenedByCompany")}</p>
        <label className="mt-4 flex cursor-pointer items-start gap-2 text-xs leading-5 text-slate-700"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-700"/>{t("certify")}</label>
        {error && <p role="alert" className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4"><Link to={`/internship/${id}`} className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 no-underline hover:bg-slate-50">{t("cancelReturn")}</Link><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-900">{t("submitApplication")} {isAr ? <ArrowLeft size={14}/> : <ArrowRight size={14}/>}</button></div>
      </form>

      <ConfirmModal
        open={confirmOpen}
        title={t("confirmApplication")}
        body={t("applicationWarning")}
        confirmLabel={t("confirmAndSubmit")}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={submitApplication}
      >
        <p className="mt-3 text-xs text-slate-500">{t("reviewBeforeConfirm")}</p>
      </ConfirmModal>
    </section>
  );
}

function ReadOnlyField({ label, value }) {
  return <div><p className="mb-1.5 text-[11px] font-medium text-slate-700">{label}</p><div className="rounded-lg bg-[#e0f1fa] px-3 py-3 text-xs text-slate-800">{value}</div></div>;
}
