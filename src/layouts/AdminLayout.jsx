import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FiLogOut,
  FiHome,
  FiGrid,
  FiUsers,
  FiPackage,
  FiTag,
  FiShoppingBag,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { logoutThunk } from "../store/slices/authSlice";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/categories", label: "Categories", icon: FiTag },
  { to: "/admin/products", label: "Products", icon: FiPackage },
  { to: "/admin/orders", label: "Orders", icon: FiShoppingBag },
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
        className="flex items-center justify-between border-b px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <Link to="/admin" className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-blue-700 sm:text-lg md:text-xl">
            ecommerce
          </span>
          <span
            className="hidden rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:inline-block"
            style={{
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              color: "var(--color-primary)",
            }}
          >
            Admin
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-lg p-2 text-sm font-medium transition hover:bg-slate-100 sm:gap-2 sm:px-3"
            style={{ color: "var(--color-text-muted)" }}
            title="Store"
          >
            <FiHome size={16} />
            <span className="hidden sm:inline">Store</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg p-2 text-sm font-medium transition hover:bg-red-50 sm:gap-2 sm:px-3"
            style={{ color: "var(--color-danger)" }}
            title="Logout"
          >
            <FiLogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile horizontal nav */}
      <div
        className="border-b md:hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex gap-1 overflow-x-auto px-2 py-2">
          {navItems.map(({ to, label, icon: Icon, end, disabled }) => (
            <NavLink
              key={to}
              to={disabled ? "#" : to}
              end={end}
              onClick={(e) => disabled && e.preventDefault()}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                disabled ? "cursor-not-allowed opacity-50" : "hover:bg-slate-100"
              }`}
              style={({ isActive }) => ({
                backgroundColor: isActive
                  ? "rgba(37, 99, 235, 0.1)"
                  : "transparent",
                color: isActive ? "var(--color-primary)" : "var(--color-text)",
              })}
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside
          className="hidden w-56 shrink-0 flex-col gap-1 border-r p-3 md:flex lg:w-64 lg:p-4"
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
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                disabled ? "cursor-not-allowed opacity-50" : "hover:bg-slate-100"
              }`}
              style={({ isActive }) => ({
                backgroundColor: isActive
                  ? "rgba(37, 99, 235, 0.1)"
                  : "transparent",
                color: isActive ? "var(--color-primary)" : "var(--color-text)",
              })}
            >
              <Icon size={16} />
              <span className="truncate">{label}</span>
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

        {/* Content */}
        <main className="min-w-0 flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;