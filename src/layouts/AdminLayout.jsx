import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FiLogOut,
  FiHome,
  FiGrid,
  FiUsers,
  FiPackage,
  FiTag,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { logoutThunk } from "../store/slices/authSlice";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/categories", label: "Categories", icon: FiTag },
  { to: "/admin/products", label: "Products", icon: FiPackage },
  { to: "/admin/users", label: "Users", icon: FiUsers, disabled: true },
];

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--color-surface-alt)" }}
    >
      {/* TOP BAR */}
      <header
        className="flex items-center justify-between border-b px-6 py-4 md:px-10"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <Link to="/admin" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-blue-700">
            ecommerce
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              color: "var(--color-primary)",
            }}
          >
            Admin
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
            style={{ color: "var(--color-text-muted)" }}
          >
            <FiHome size={16} />
            <span className="hidden sm:inline">Store</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-red-50"
            style={{ color: "var(--color-danger)" }}
          >
            <FiLogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* BODY: SIDEBAR + CONTENT */}
      <div className="flex flex-1">
        <aside
          className="hidden w-64 flex-col gap-1 border-r p-4 md:flex"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          {navItems.map(({ to, label, icon: Icon, end, disabled }) => (
            <NavLink
              key={to}
              to={disabled ? "#" : to}
              end={end}
              onClick={(e) => disabled && e.preventDefault()}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                disabled ? "cursor-not-allowed opacity-50" : "hover:bg-slate-100"
              }`}
              style={({ isActive }) => ({
                backgroundColor: isActive
                  ? "rgba(37, 99, 235, 0.1)"
                  : "transparent",
                color: isActive ? "var(--color-primary)" : "var(--color-text)",
              })}
            >
              <Icon size={18} />
              {label}
              {disabled && (
                <span
                  className="ml-auto text-[10px] uppercase"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Soon
                </span>
              )}
            </NavLink>
          ))}
        </aside>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;