import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCheck, Clock3 } from "lucide-react";
import { useI18n } from "../i18n";
import DetailModal from "../Component/DetailModal";

const STORAGE_KEY = "opream_notifications";

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Exam Scheduled",
    body: "Your technical entrance exam for Frontend Development Internship at ITI has been scheduled for Nov 12, 2024 at 10:00 AM",
    time: "2 hours ago",
    category: "Technical Assessment",
    categoryKey: "exams",
    categoryColor: "text-teal-700",
    read: true,
    target: "/exams",
  },
  {
    id: 2,
    title: "Application Status Update",
    body: "Your application for Data Analysis Internship at NTI has moved to Exam Scheduled",
    time: "1 day ago",
    category: "Placement Pipeline",
    categoryKey: "applications",
    categoryColor: "text-blue-700",
    read: true,
    target: "/applications",
  },
  {
    id: 3,
    title: "Welcome to Opream Web Student Portal",
    body: "Your academic profile has been synced from the university registrar",
    time: "3 days ago",
    category: "University Registrar",
    categoryKey: "system",
    categoryColor: "text-slate-500",
    read: false,
    target: "/profile",
  },
];

function readStored() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (Array.isArray(saved)) return saved;
  } catch {
    // ignore invalid stored state
  }
  return NOTIFICATIONS.filter((item) => item.read).map((item) => item.id);
}

export default function Notifications() {
  const { t } = useI18n();
  const [readIds, setReadIds] = useState(readStored);
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);

  const isRead = (id) => readIds.includes(id);
  const allRead = NOTIFICATIONS.every((item) => isRead(item.id));

  function persist(ids) {
    setReadIds(ids);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }

  function markRead(id) {
    if (isRead(id)) return;
    persist([...readIds, id]);
  }

  const filters = [
    { key: "all", label: t("all") },
    { key: "applications", label: t("applications") },
    { key: "results", label: t("results") },
    { key: "exams", label: t("exams") },
  ];
  const visible = NOTIFICATIONS.filter((item) => filter === "all" || item.categoryKey === filter);

  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-slate-900">{t("notifications")}</h1>
        <button
          type="button"
          disabled={allRead}
          onClick={() => persist(NOTIFICATIONS.map((item) => item.id))}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 underline-offset-4 transition hover:text-blue-900 hover:underline disabled:cursor-default disabled:text-slate-400 disabled:no-underline"
        >
          <CheckCheck size={14} /> {t("markAllAsRead")}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={
              "px-4 py-1.5 rounded-full text-xs font-medium border transition-colors " +
              (filter === item.key
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800")
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((notification) => (
          <article
            key={notification.id}
            className={
              "rounded-xl border border-slate-200 p-4 shadow-sm transition-colors " +
              (isRead(notification.id) ? "bg-slate-50/50" : "bg-white border-blue-100")
            }
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-start gap-3">
                <span className={`flex h-2.5 w-2.5 shrink-0 rounded-full mt-1.5 ${isRead(notification.id) ? "bg-blue-600" : "bg-blue-300 ring-4 ring-blue-50"}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 leading-snug">
                    {notification.title}: {notification.body}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                    <Clock3 size={12} className="shrink-0" />
                    <span>{notification.time}</span>
                    <span className={"text-xs font-semibold " + notification.categoryColor}>
                      {notification.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => { setDetail(notification); markRead(notification.id); }}
                  className="text-xs font-medium text-blue-700 underline-offset-4 hover:text-blue-900 hover:underline"
                >
                  {t("viewDetails")}
                </button>
                <button
                  type="button"
                  disabled={isRead(notification.id)}
                  onClick={() => markRead(notification.id)}
                  className="text-xs font-medium text-slate-400 underline-offset-4 hover:text-slate-600 hover:underline disabled:cursor-default disabled:text-slate-300 disabled:no-underline"
                >
                  {t("markAsRead")}
                </button>
              </div>
            </div>
          </article>
        ))}
        {visible.length === 0 && <div className="rounded-xl bg-white p-10 text-center text-sm text-slate-500">{t("noResults")}</div>}
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">{t("archivedNotice")}</p>

      <DetailModal
        open={Boolean(detail)}
        title={t("notificationDetails")}
        onClose={() => setDetail(null)}
        footer={
          <Link to={detail?.target || "/notifications"} onClick={() => setDetail(null)} className="rounded-lg bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white no-underline hover:bg-blue-800">
            {t("goToPage")}
          </Link>
        }
      >
        {detail && (
          <>
            <p className="text-base font-semibold text-slate-900">{detail.title}</p>
            <p>{detail.body}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Clock3 size={13} /> {detail.time}</span>
              <span className={`font-semibold ${detail.categoryColor}`}>{detail.category}</span>
              <span>{isRead(detail.id) ? t("markAsRead") : t("unread")}</span>
            </div>
          </>
        )}
      </DetailModal>
    </section>
  );
}
