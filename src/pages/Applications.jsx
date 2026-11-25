import { useState } from "react";
import { Clock3, MapPin } from "lucide-react";
import { useI18n } from "../i18n";
import DetailModal from "../Component/DetailModal";
import ConfirmModal from "../Component/ConfirmModal";

const APPLICATIONS = [
  {
    id: 1,
    internshipId: 1,
    isLive: true,
    organization: "Information Technology Institute",
    shortName: "ITI",
    title: "Frontend Development Internship",
    track: "Web Development",
    location: "Cairo / Hybrid",
    date: "June 25, 2026",
    status: "exam_scheduled",
  },
  {
    id: 2,
    internshipId: 2,
    isLive: true,
    organization: "Information Technology Institute",
    shortName: "ITI",
    title: "Backend Development Internship",
    track: "Web Development",
    location: "Cairo / Hybrid",
    date: "June 26, 2026",
    status: "screening",
  },
  {
    id: 3,
    internshipId: 3,
    isLive: true,
    organization: "Information Technology Institute",
    shortName: "ITI",
    title: "UI/UX Design Internship",
    track: "Web Development",
    location: "Cairo / Hybrid",
    date: "June 28, 2026",
    status: "submitted",
  },
];

function readApplications() {
  try {
    const saved = JSON.parse(localStorage.getItem("opreamApplications") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function statusKey(status) {
  const normalized = String(status || "submitted").toLowerCase().replace(/[\s-]+/g, "_");
  const keys = {
    submitted: "submitted",
    pending: "submitted",
    screening: "screeningStep",
    exam_scheduled: "examScheduled",
    approved: "approved",
    accepted: "approved",
    rejected: "rejected",
    withdrawn: "withdrawn",
  };
  return keys[normalized] || "submitted";
}

const STATUS_STYLES = {
  submitted: "bg-slate-100 text-slate-700",
  screeningStep: "bg-sky-100 text-sky-800",
  examScheduled: "bg-violet-100 text-violet-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  withdrawn: "bg-amber-100 text-amber-800",
};

export default function Applications() {
  const { t } = useI18n();
  const [detail, setDetail] = useState(null);
  const [applications, setApplications] = useState(readApplications);
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawnIds, setWithdrawnIds] = useState([]);
  const liveApplications = applications.map((item, index) => ({
    id: `live-${index}`,
    internshipId: item.internshipId,
    isLive: true,
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
  const allApplications = [...liveApplications, ...APPLICATIONS].filter((app) => !withdrawnIds.includes(app.id));

  function withdrawApplication() {
    if (!withdrawTarget) return;
    const updated = applications.filter((item) => String(item.internshipId) !== String(withdrawTarget.internshipId));
    localStorage.setItem("opreamApplications", JSON.stringify(updated));
    setApplications(updated);
    setWithdrawnIds((previous) => [...previous, withdrawTarget.id]);
    setDetail(null);
    setWithdrawTarget(null);
  }

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
                <span className={`mb-3 inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${STATUS_STYLES[statusKey(app.status)]}`}>
                  {t(statusKey(app.status))}
                </span>
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

      <DetailModal
        open={Boolean(detail)}
        title={t("applicationDetails")}
        onClose={() => setDetail(null)}
        footer={detail?.isLive && statusKey(detail.status) !== "withdrawn" ? (
          <button type="button" onClick={() => setWithdrawTarget(detail)} className="rounded-lg bg-rose-700 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-800">
            {t("withdrawApplication")}
          </button>
        ) : null}
      >
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
      <ConfirmModal
        open={Boolean(withdrawTarget)}
        title={t("withdrawConfirm")}
        body={t("withdrawWarning")}
        confirmLabel={t("withdrawApplication")}
        danger
        onCancel={() => setWithdrawTarget(null)}
        onConfirm={withdrawApplication}
      />
    </section>
  );
}
