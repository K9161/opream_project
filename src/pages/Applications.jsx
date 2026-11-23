import { useState } from "react";
import { Clock3, MapPin } from "lucide-react";
import { useI18n } from "../i18n";
import DetailModal from "../Component/DetailModal";

const APPLICATIONS = [
  {
    id: 1,
    organization: "Information Technology Institute",
    shortName: "ITI",
    title: "Frontend Development Internship",
    track: "Web Development",
    location: "Cairo / Hybrid",
    date: "June 25, 2026",
  },
  {
    id: 2,
    organization: "Information Technology Institute",
    shortName: "ITI",
    title: "Backend Development Internship",
    track: "Web Development",
    location: "Cairo / Hybrid",
    date: "June 26, 2026",
  },
  {
    id: 3,
    organization: "Information Technology Institute",
    shortName: "ITI",
    title: "UI/UX Design Internship",
    track: "Web Development",
    location: "Cairo / Hybrid",
    date: "June 28, 2026",
  },
];

export default function Applications() {
  const { t } = useI18n();
  const [detail, setDetail] = useState(null);

  let saved;
  try {
    saved = JSON.parse(localStorage.getItem("opreamApplications") || "[]");
  } catch {
    saved = [];
  }
  const liveApplications = (Array.isArray(saved) ? saved : []).map((item, index) => ({
    id: `live-${index}`,
    organization: item.organization || "Information Technology Institute",
    shortName: item.shortName || "ITI",
    title: item.title || "Frontend Development Internship",
    track: item.track || "Web Development",
    location: item.location || "Cairo / Hybrid",
    date: item.submittedAt ? new Date(item.submittedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—",
    cv: item.cv,
    statement: item.statement,
    status: item.status,
  }));
  const allApplications = [...liveApplications, ...APPLICATIONS];

  return (
    <section className="mx-auto max-w-6xl">
      <h1 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-6">
        {t("applications")}
      </h1>

      <div className="space-y-3">
        {allApplications.map((app) => (
          <article
            key={app.id}
            className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                {app.shortName}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs text-slate-500 block mb-0.5">
                  {app.organization}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {app.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-medium text-slate-400">
                      {t("track")}
                    </span>
                    <p className="font-semibold text-slate-800">{app.track}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    <span className="font-semibold text-slate-800">
                      {app.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock3 size={12} className="text-slate-400" />
                    <span className="text-[10px] font-medium text-slate-400">{t("registrationDate")}</span>
                    <span className="font-semibold text-slate-800">{app.date}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetail(app)}
                className="shrink-0 self-start rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                {t("viewDetails")}
              </button>
            </div>
          </article>
        ))}
      </div>

      <DetailModal open={Boolean(detail)} title={t("applicationDetails")} onClose={() => setDetail(null)}>
        {detail && (
          <>
            <p className="text-base font-semibold text-slate-900">{detail.title}</p>
            <p className="text-sm text-slate-500">{detail.organization}</p>
            <div className="grid gap-2 rounded-xl bg-slate-50 p-4 text-xs sm:grid-cols-2">
              <span><strong className="text-slate-800">{t("track")}:</strong> {detail.track}</span>
              <span><strong className="text-slate-800">{t("location")}:</strong> {detail.location}</span>
              <span><strong className="text-slate-800">{t("registrationDate")}:</strong> {detail.date}</span>
              <span><strong className="text-slate-800">{t("status")}:</strong> {detail.status || t("submitted")}</span>
              {detail.cv && <span className="sm:col-span-2"><strong className="text-slate-800">{t("cvSelected")}:</strong> {detail.cv}</span>}
              {detail.statement && <span className="sm:col-span-2"><strong className="text-slate-800">{t("personalStatement")}:</strong> {detail.statement}</span>}
            </div>
          </>
        )}
      </DetailModal>
    </section>
  );
}
