import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Award,
  FolderOpen,
  Truck,
  Leaf,
} from "lucide-react";

const menuItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/clientes", label: "Clientes", icon: Users },
  { path: "/processos", label: "Processos", icon: FileText },
  { path: "/licencas", label: "Licenças & Condicionantes", icon: Award },
  { path: "/documentos", label: "Documentos (Dropbox)", icon: FolderOpen },
  { path: "/mtrs", label: "MTRs & Resíduos", icon: Truck },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen flex flex-col border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="p-2 bg-emerald-500 rounded-lg text-slate-950">
          <Leaf className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none">EcoTrack</h1>
          <span className="text-xs text-slate-400">Consultoria Ambiental</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
