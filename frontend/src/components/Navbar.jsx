import { Compass, LayoutDashboard, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-white/15 text-white"
      : "text-slate-200 hover:bg-white/10 hover:text-white"
  }`;

export default function Navbar() {
  return (
    <header className="bg-[#0B1F3A] text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <NavLink to="/" className="inline-flex items-center gap-2 text-lg font-semibold">
          <Compass className="h-6 w-6 text-blue-300" aria-hidden="true" />
          Pathwise
        </NavLink>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            <UserRound className="h-4 w-4" aria-hidden="true" />
            Profile
          </NavLink>
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
