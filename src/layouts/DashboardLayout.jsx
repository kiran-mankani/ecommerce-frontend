import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiHome, FiShoppingCart, FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";
import { logoutThunk } from "../store/slices/authSlice";
import { logoutApi } from "../services/userService";

/* Convert /uploads/... to a full URL pointing at the backend */
const resolveImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const apiBase =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
  const origin = apiBase.replace(/\/api\/v1\/?$/, "");

  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
};

/* Small avatar component used in the header */
const HeaderAvatar = ({ user }) => {
  const [errored, setErrored] = useState(false);
  const path = user?.profile?.profileImage;
  const src = resolveImageUrl(path);
  const initials = (user?.name || "U")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src && !errored) {
    return (
      <img
        src={src}
        alt={user?.name || "user"}
        onError={() => setErrored(true)}
        className="h-7 w-7 rounded-full object-cover"
        style={{ border: "1px solid var(--color-border)" }}
      />
    );
  }

  return (
    <div
      className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
      style={{
        background:
          "linear-gradient(160deg, var(--color-brand-gradient-start) 0%, var(--color-brand-gradient-end) 100%)",
      }}
    >
      {initials}
    </div>
  );
};

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => s.cart?.count || 0);

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
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-blue-700">
            ecommerce
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
            style={{ color: "var(--color-text-muted)" }}
          >
            <FiHome size={16} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
            style={{ color: "var(--color-text-muted)" }}
          >
            <FiShoppingCart size={16} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                style={{ backgroundColor: "var(--color-danger)" }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition hover:bg-slate-100"
            title="My Profile"
          >
            <HeaderAvatar user={user} />
            <span
              className="hidden text-sm font-medium sm:inline"
              style={{ color: "var(--color-text-muted)" }}
            >
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

      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;