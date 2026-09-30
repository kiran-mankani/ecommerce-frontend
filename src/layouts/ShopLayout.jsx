import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiShoppingCart, FiLogOut, FiGrid } from "react-icons/fi";
import toast from "react-hot-toast";
import { logoutThunk } from "../store/slices/authSlice";
import { logoutApi } from "../services/userService";

const resolveImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const apiBase =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
  const origin = apiBase.replace(/\/api\/v1\/?$/, "");

  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
};

const HeaderAvatar = ({ user, size = 8 }) => {
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

  const sizeClass = size === 7 ? "h-7 w-7" : "h-8 w-8";

  if (src && !errored) {
    return (
      <img
        src={src}
        alt={user?.name || "user"}
        onError={() => setErrored(true)}
        className={`${sizeClass} rounded-full object-cover`}
        style={{ border: "1px solid var(--color-border)" }}
      />
    );
  }

  return (
    <div
      className={`flex ${sizeClass} items-center justify-center rounded-full text-xs font-bold text-white`}
      style={{
        background:
          "linear-gradient(160deg, var(--color-brand-gradient-start) 0%, var(--color-brand-gradient-end) 100%)",
      }}
    >
      {initials}
    </div>
  );
};

const ShopLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => s.cart?.count || 0);
  const isAdmin = isAuthenticated && user?.role === "admin";

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
      {/* ================= TOP BAR ================= */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 md:gap-6 md:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="text-base font-bold tracking-tight text-blue-700 sm:text-lg md:text-xl">
              ecommerce
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            {/* Admin link — visible on all screen sizes */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 rounded-lg p-2 text-sm font-medium transition hover:bg-slate-100 sm:gap-2 sm:px-3"
                style={{ color: "var(--color-text-muted)" }}
                title="Admin"
              >
                <FiGrid size={16} />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* Cart icon — hidden for admin */}
            {!isAdmin && (
              <Link
                to="/cart"
                className="relative flex items-center gap-2 rounded-lg p-2 text-sm font-medium transition hover:bg-slate-100 sm:px-3"
                style={{ color: "var(--color-text)" }}
                title="Cart"
              >
                <FiShoppingCart size={18} />
                {cartCount > 0 && (
                  <span
                    className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                    style={{ backgroundColor: "var(--color-danger)" }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 transition hover:bg-slate-100 sm:px-2"
                  title="My Profile"
                >
                  <HeaderAvatar user={user} size={8} />
                  <span
                    className="hidden text-sm font-medium sm:inline"
                    style={{ color: "var(--color-text)" }}
                  >
                    {user?.name?.split(" ")[0] || "Profile"}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium transition hover:bg-red-50 sm:px-3"
                  style={{ color: "var(--color-danger)" }}
                  title="Logout"
                >
                  <FiLogOut size={16} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        <Outlet />
      </main>

      {/* ================= FOOTER ================= */}
      <footer
        className="border-t py-6 text-center text-xs"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-text-muted)",
        }}
      >
        © {new Date().getFullYear()} Ecommerce. All rights reserved.
      </footer>
    </div>
  );
};

export default ShopLayout;