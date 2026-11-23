import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Code2, MapPin, CalendarDays, Share2, Search } from "lucide-react";
import { useI18n } from "../i18n";

const INTERNSHIPS = [
  { id: 1, key: "title", shortName: "ITI", organizationKey: "organization", trackKey: "web", locationKey: "cairo", deadline: "June 30, 2026", popularity: 142 },
  { id: 2, key: "backendInternship", shortName: "ITI", organizationKey: "organization", trackKey: "web", locationKey: "cairo", deadline: "November 30, 2024", popularity: 98 },
  { id: 3, key: "uxInternship", shortName: "ITI", organizationKey: "organization", trackKey: "web", locationKey: "cairo", deadline: "November 30, 2024", popularity: 76 },
  { id: 4, key: "flutterInternship", shortName: "ITI", organizationKey: "organization", trackKey: "web", locationKey: "cairo", deadline: "November 30, 2024", popularity: 54 },
];

function readApplications() {
  try {
    const saved = JSON.parse(localStorage.getItem("opreamApplications") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function readGpa() {
  try {
    const saved = JSON.parse(localStorage.getItem("opream_user") || "{}");
    return Number(saved.gpa) || 3.94;
  } catch {
    return 3.94;
  }
}

export default function Internship() {
  const { t, language } = useI18n();
  const [activeFilter, setActiveFilter] = useState("allTracks");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const applications = readApplications();
  const gpa = readGpa();
  const eligible = gpa >= 3.0;
  const filters = [{key:"allTracks",label:t("allTracks")},{key:"oldest",label:t("oldest")},{key:"newest",label:t("newest")},{key:"common",label:t("common")}];

  const visibleInternships = useMemo(() => {
    const term = search.trim().toLowerCase();
    const result = INTERNSHIPS.filter((item) => {
      const haystack = `${t(item.key)} ${t(item.organizationKey)} ${t(item.trackKey)} ${t(item.locationKey)} ${item.deadline}`.toLowerCase();
      return !term || haystack.includes(term);
    });
    if (activeFilter === "oldest") return [...result].reverse();
    if (activeFilter === "newest") return [...result].sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    if (activeFilter === "common") return [...result].sort((a, b) => b.popularity - a.popularity);
    return result;
  }, [activeFilter, search, t]);

  async function shareInternship(id) {
    const url = `${window.location.origin}/internship/${id}`;
    try { await navigator.clipboard.writeText(url); setCopiedId(id); setTimeout(() => setCopiedId(null), 1800); }
    catch { window.prompt(language === "ar" ? "انسخ رابط التدريب:" : "Copy internship link:", url); }
  }

  return <section className="mx-auto w-full max-w-6xl">
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800">{t("internships")}</h1>
        <p className="mt-1 text-xs font-medium text-blue-700">{applications.length} / 3 {t("applicationsUsed")}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">{filters.map(filter => <button key={filter.key} onClick={()=>setActiveFilter(filter.key)} className={`rounded-full px-4 py-2 text-xs transition ${activeFilter===filter.key ? "bg-blue-100 font-semibold text-blue-700" : "text-slate-500 hover:bg-white"}`}>{filter.label}</button>)}</div>
    </div>

    <label className="mb-4 flex max-w-sm items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-400 focus-within:border-blue-400"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("departmentTrack")} className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"/></label>

    {!eligible ? (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-10 text-center">
        <AlertCircle size={28} className="text-amber-700" />
        <h2 className="text-base font-bold text-amber-900">{t("notEligible")}</h2>
        <p className="text-sm text-amber-800">{t("notEligibleReason")}</p>
      </div>
    ) : (
      <div className="space-y-3">{visibleInternships.map(item => {
        const applied = applications.some((app) => String(app.internshipId) === String(item.id));
        const passed = item.deadline.includes("2024");
        return (
          <article key={item.id} className={`rounded-xl border bg-white p-4 transition hover:border-blue-100 hover:shadow-sm sm:p-5 ${passed ? "border-slate-200 opacity-80" : "border-slate-100"}`}>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{item.shortName}</span>
              <span className="text-xs font-semibold text-slate-600">{t(item.organizationKey)}</span>
              {applied && <span className="rounded-full bg-teal-100 px-3 py-1 text-[10px] font-semibold text-teal-800">{t("alreadyAppliedBadge")}</span>}
              {passed && <span className="rounded-full bg-rose-50 px-3 py-1 text-[10px] font-semibold text-rose-700">{t("deadlinePassed")}</span>}
              <div className="ms-auto flex items-center gap-2">
                <button onClick={()=>shareInternship(item.id)} aria-label="Share internship" title={copiedId===item.id ? t("copied") : t("share")} className="flex h-9 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"><Share2 size={15}/></button>
                <Link to={`/internship/${item.id}`} className="rounded-lg px-4 py-2.5 text-center text-xs font-semibold text-blue-700 no-underline hover:bg-blue-50">{t("viewDetails")}</Link>
              </div>
            </div>
            <Link to={`/internship/${item.id}`} className="text-slate-800 no-underline hover:text-blue-700"><h2 className="mb-4 text-lg font-bold">{t(item.key)}</h2></Link>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div><p className="mb-1.5 text-[10px] font-medium text-slate-400">{t("track")}</p><p className="flex items-center gap-2 text-xs font-semibold text-slate-800"><Code2 size={13} className="text-blue-600"/>{t(item.trackKey)}</p></div>
              <div><p className="mb-1.5 text-[10px] font-medium text-slate-400">{t("location")}</p><p className="flex items-center gap-2 text-xs font-semibold text-slate-800"><MapPin size={13} className="text-blue-600"/>{t(item.locationKey)}</p></div>
              <div><p className="mb-1.5 text-[10px] font-medium text-slate-400">{t("deadline")}</p><p className="flex items-center gap-2 text-xs font-semibold text-slate-800"><CalendarDays size={13} className="text-blue-600"/>{item.deadline}</p></div>
            </div>
          </article>
        );
      })}{visibleInternships.length===0 && <div className="rounded-xl bg-white p-10 text-center text-sm text-slate-500">{t("noResults")}</div>}</div>
    )}
  </section>;
}
