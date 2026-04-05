import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/novo-post", label: "Novo Post" },
  { to: "/agendados", label: "Agendados" },
  { to: "/contas", label: "Contas" },
];

export default function Layout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-indigo-700 text-white flex flex-col">
        <div className="px-6 py-5 text-xl font-bold tracking-wide border-b border-indigo-600">
          Social Poster
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-900 text-white"
                    : "text-indigo-200 hover:bg-indigo-600 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mx-4 mb-4 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
        >
          Sair
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
