import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowUpRight, BookOpen, CalendarDays, CalendarRange, CheckCircle2,
  ClipboardCheck, Clock3, Code2, Layers, MapPin, Share2, Timer, Users,
} from "lucide-react";
import { useI18n } from "../i18n";
import Notfound from "./Notfound";

const OPPORTUNITIES = {
  "1": { title: "title", track: "web", tracks: [{ name: "internshipFrontend", seats: 20 }, { name: "internshipBackend", seats: 23 }] },
  "2": { title: "backendInternship", track: "web", tracks: [{ name: "internshipBackend", seats: 23 }] },
  "3": { title: "uxInternship", track: "uiUxTrack", tracks: [{ name: "designTrack", seats: 18 }] },
  "4": { title: "flutterInternship", track: "mobileTrack", tracks: [{ name: "flutterTrack", seats: 20 }] },
};

export default function InternshipDetails() {
  const { id } = useParams();
  const { t, language } = useI18n();
  const [copied, setCopied] = useState(false);
  const isAr = language === "ar";
  const opportunity = OPPORTUNITIES[id];

  if (!opportunity) return <Notfound />;

  async function share() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt(t("share"), url);
    }
  }

  const requirements = [
    [t("academicStanding"), t("academicStandingDesc")],
    [t("minimumGpa"), t("minimumGpaDesc")],
    [t("technicalFoundation"), t("technicalFoundationDesc")],
  ];

  return (
    <section className="mx-auto w-full max-w-6xl space-y-5">
      <Link to="/internship" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 no-underline hover:text-blue-700">
        <ArrowLeft size={14} className={isAr ? "rotate-180" : ""} /> {t("backToInternships")}
      </Link>

      <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4 sm:p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-xs font-bold italic text-white">{t("organizationShort")}</div>
          <span className="text-xs font-semibold italic text-slate-700">{t("organization")}</span>
          <div className="ms-auto flex items-center gap-2">
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <h1 className="mb-5 text-xl font-bold text-slate-900 sm:text-2xl">{t(opportunity.title)}</h1>
          <div className="grid gap-4 border-b border-slate-200 pb-5 sm:grid-cols-2 lg:grid-cols-4">
            <div><p className="mb-1 text-[10px] font-semibold tracking-wide text-slate-400">{t("track")}</p><p className="flex items-center gap-2 text-xs font-semibold text-slate-800"><Code2 size={14} className="text-blue-600"/>{t(opportunity.track)}</p></div>
            <div><p className="mb-1 text-[10px] font-semibold tracking-wide text-slate-400">{t("location")}</p><p className="flex items-center gap-2 text-xs font-semibold text-slate-800"><MapPin size={14} className="text-blue-600"/>{t("cairo")}</p></div>
            <div><p className="mb-1 text-[10px] font-semibold tracking-wide text-slate-400">{t("applicationDeadline")}</p><p className="flex items-center gap-2 text-xs font-semibold text-slate-800"><CalendarDays size={14} className="text-blue-600"/>{isAr ? "30 يونيو 2026" : "June 30, 2026"}</p></div>
            <div><p className="mb-1 text-[10px] font-semibold tracking-wide text-slate-400">{t("startDateEndDate")}</p><p className="flex items-center gap-2 text-xs font-semibold italic text-slate-800"><CalendarRange size={14} className="text-blue-600"/>1/7/2026 – 1/8/2026</p></div>
          </div>

          <div className="grid gap-7 border-b border-slate-200 py-6 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800"><Layers size={18} className="text-blue-700"/>{t("availableTracks")}</h2>
              <div className="space-y-3">
                {opportunity.tracks.map((track) => (
                  <div key={track.name} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3">
                    <span className="text-sm font-semibold italic text-slate-900">{t(track.name)}</span>
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-700"><Users size={14} className="text-blue-600"/>{t("seats")}: {track.seats}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800"><Clock3 size={18} className="text-blue-700"/>{t("workingSchedule")}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-4">
                  <p className="text-[10px] font-medium text-slate-500">{t("dailyWorkingHours")}</p>
                  <p className="mt-2 text-sm font-bold text-slate-900">{t("hours120")}</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-4">
                  <p className="text-[10px] font-medium text-slate-500">{t("dailyWorkingDays")}</p>
                  <p className="mt-2 text-sm font-bold text-slate-900">{t("days30")}</p>
                </div>
              </div>
            </div>
          </div>

          <p className="py-5 text-sm italic leading-7 text-slate-600">{t("description")}</p>

          <div className="grid gap-7 border-t border-slate-200 pt-5 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800"><ClipboardCheck size={17} className="text-blue-700"/>{t("requirements")}</h2>
              <div className="space-y-4">
                {requirements.map(([heading, description]) => <div key={heading} className="flex gap-3"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-teal-700"/><div><h3 className="text-xs font-semibold text-slate-800">{heading}</h3><p className="mt-1 text-[11px] leading-5 text-slate-500">{description}</p></div></div>)}
              </div>
            </div>
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800"><BookOpen size={17} className="text-blue-700"/>{t("entranceInfo")}</h2>
              <div className="rounded-xl border border-violet-100 bg-[#f7f5ff] p-4">
                <div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-700"><Timer size={19}/></span><div><h3 className="text-xs font-bold text-slate-800">{t("mandatoryAssessment")}</h3><p className="mt-1 text-[11px] leading-5 text-slate-500">{t("assessmentDesc")}</p></div></div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-violet-200 pt-3"><div><p className="text-[10px] text-slate-500">{t("duration")}</p><p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-800"><Clock3 size={13}/>{t("duration45")}</p></div><div><p className="text-[10px] text-slate-500">{t("timing")}</p><p className="mt-1 text-xs font-semibold text-slate-800">{t("afterReview")}</p></div></div>
                <p className="mt-3 border-t border-violet-200 pt-3 text-[10px] leading-5 text-slate-500">{t("personalizedLinkNote")}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 px-4 py-4 sm:px-6"><p className="text-[11px] italic text-slate-500">{t("officialNote")}</p><Link to={`/internship/${id}/apply`} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-xs font-semibold text-white no-underline hover:bg-blue-800">{t("apply")} <ArrowUpRight size={14}/></Link></div>
      </article>
    </section>
  );
}
