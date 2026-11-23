import { useState } from "react";
import { NavLink } from "react-router-dom";
import { GraduationCap, BriefcaseBusiness, FileText, ClipboardList, Bell, UserRound, CircleHelp, LogOut } from "lucide-react";
import { useI18n } from "../i18n";
import ConfirmModal from "./ConfirmModal";

export default function StudentSidebar({ logOut }) {
  const { t } = useI18n();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const links = [
    { to: "/internship", label: t("internships"), icon: BriefcaseBusiness },
    { to: "/applications", label: t("applications"), icon: FileText },
    { to: "/exams", label: t("exams"), icon: ClipboardList },
    { to: "/notifications", label: t("notifications"), icon: Bell },
    { to: "/profile", label: t("profile"), icon: UserRound },
  ];

  return (
    <>
      <aside className="flex min-h-screen w-[220px] shrink-0 flex-col border-e border-slate-100 bg-white px-3 py-4 max-sm:w-[68px] max-sm:px-2">
        <NavLink to="/internship" className="mb-7 flex items-center gap-2 rounded-xl px-2 py-2 text-blue-700 no-underline">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50"><GraduationCap size={21}/></span>
          <span className="max-sm:hidden"><span className="block text-sm font-bold">{t("portal")}</span><span className="block text-[10px] text-slate-500">{t("subtitle")}</span></span>
        </NavLink>
        <nav className="flex-1 space-y-1">{links.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} className={({isActive})=>`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs no-underline transition-colors max-sm:justify-center max-sm:px-2 ${isActive ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}><Icon size={16}/><span className="max-sm:hidden">{label}</span></NavLink>)}</nav>
        <div className="space-y-1 border-t border-slate-100 pt-3"><a href="mailto:portal-support@university.edu" title={t("supportEmail")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-500 no-underline hover:bg-slate-50 max-sm:justify-center max-sm:px-2"><CircleHelp size={16}/><span className="max-sm:hidden">{t("help")}</span></a><button onClick={() => setConfirmOpen(true)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-500 hover:bg-red-50 hover:text-red-600 max-sm:justify-center max-sm:px-2"><LogOut size={16}/><span className="max-sm:hidden">{t("logout")}</span></button></div>
      </aside>

      <ConfirmModal
        open={confirmOpen}
        title={t("confirmLogout")}
        body={t("logoutWarning")}
        confirmLabel={t("logout")}
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={logOut}
      />
    </>
  );
}
