import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BriefcaseBusiness, FileText, ClipboardList, Bell, UserRound, CircleHelp, LogOut } from "lucide-react";
import { useI18n } from "../i18n";
import ConfirmModal from "./ConfirmModal";
import logo from "../assets/Logo.png";

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
        <NavLink to="/internship" aria-label="Opream Web" className="mb-7 flex items-center justify-center rounded-xl px-2 py-1 no-underline">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b4bd4] to-[#062d91] shadow-md shadow-blue-900/20 ring-4 ring-blue-50 max-sm:h-11 max-sm:w-11 max-sm:rounded-xl">
            <img src={logo} alt="Opream Web" className="h-full w-full object-contain" />
          </span>
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
