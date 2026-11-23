import { AlertTriangle } from "lucide-react";
import { useI18n } from "../i18n";

// Reusable confirmation dialog used for logout, application submission and withdrawal.
export default function ConfirmModal({ open, title, body, confirmLabel, onConfirm, onCancel, danger = false, children }) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex gap-4">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${danger ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-700"}`}>
            <AlertTriangle size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            {body && <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>}
            {children}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
            {t("cancel")}
          </button>
          <button type="button" onClick={onConfirm} className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ${danger ? "bg-rose-700 hover:bg-rose-800" : "bg-blue-700 hover:bg-blue-800"}`}>
            {confirmLabel || t("confirm")}
          </button>
        </div>
      </div>
  
    </div>
  );
}
