import { X } from "lucide-react";
import { useI18n } from "../i18n";

// Lightweight read-only dialog for "View Details" actions across pages.
export default function DetailModal({ open, title, onClose, children, footer }) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label={t("cancel")} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="space-y-3 px-5 py-5 text-sm leading-6 text-slate-600">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
