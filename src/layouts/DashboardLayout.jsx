import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiHome,
  FiLogOut,
  FiUser,
  FiShoppingCart,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { logoutThunk } from "../store/slices/authSlice";
import { logoutApi } from "../services/userService";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (_) {
      /* ignore */
    }
    await dispatch(logoutThunk());
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--color-surface-alt)" }}
    >
      <header
        className="flex items-center justify-between border-b px-6 py-4 md:px-10"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-blue-700">
            ecommerce
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
            style={{ color: "var(--color-text-muted)" }}
          >
            <FiHome size={16} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <button
            type="button"
            onClick={() => toast("Cart comes in Phase 8")}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
            style={{ color: "var(--color-text-muted)" }}
          >
            <FiShoppingCart size={16} />
            <span className="hidden sm:inline">Cart</span>
          </button>

          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
            style={{ color: "var(--color-text-muted)" }}
          >
            <FiUser size={16} />
            <span className="hidden sm:inline">
              {user?.name?.split(" ")[0] || "Profile"}
            </span>
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
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;