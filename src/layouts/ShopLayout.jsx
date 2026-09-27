import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiGrid,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { logoutThunk } from "../store/slices/authSlice";

const ShopLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => s.cart?.items?.length || 0);

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
      {/* ================= TOP BAR ================= */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-6 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-blue-700">
              ecommerce
            </span>
          </Link>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1">
            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin"
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100 sm:flex"
                style={{ color: "var(--color-text-muted)" }}
              >
                <FiGrid size={16} />
                <span>Admin</span>
              </Link>
            )}

            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
              style={{ color: "var(--color-text)" }}
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

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
                  style={{ color: "var(--color-text)" }}
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
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6">
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