import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Award,
  FolderOpen,
  Truck,
  Leaf,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const menuItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/clientes", label: "Clientes", icon: Users },
  { path: "/processos", label: "Processos", icon: FileText },
  { path: "/licencas", label: "Licenças & Condicionantes", icon: Award },
  { path: "/documentos", label: "Documentos (Dropbox)", icon: FolderOpen },
  { path: "/mtrs", label: "MTRs & Resíduos", icon: Truck },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

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

      {/* Card do Usuário Logado + Botão Sair */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-slate-800 rounded-full text-emerald-400">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {user?.nome || "Usuário"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/60 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 text-xs font-medium rounded-lg border border-slate-700/50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Encerrar Sessão
        </button>
      </div>
    </aside>
  );
}
