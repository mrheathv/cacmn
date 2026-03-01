"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  ClipboardList,
  FileText,
  Receipt,
  BookOpen,
  LogOut,
  HardHat,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/work-orders", label: "Work Orders", icon: ClipboardList },
  { href: "/dashboard/estimates", label: "Estimates", icon: FileText },
  { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
  { href: "/dashboard/field-reports", label: "Field Reports", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full w-64 flex-shrink-0" style={{ background: "#0f2a4a" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ background: "#f97316" }}>
          <HardHat className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">Construction OS</div>
          <div className="text-slate-400 text-xs">Construct-All Corp</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              style={active ? { background: "#f97316" } : {}}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
