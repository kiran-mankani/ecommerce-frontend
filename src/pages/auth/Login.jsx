import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiMail, FiLock, FiEye, FiEyeOff, FiHome } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import {
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineSupport,
} from "react-icons/hi";
import toast from "react-hot-toast";
import { loginThunk } from "../../store/slices/authSlice";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(
      loginThunk({ email: formData.email, password: formData.password })
    );

    if (loginThunk.fulfilled.match(result)) {
      toast.success("Login successful!");
      const role = result.payload.data.user.role;
      navigate(role === "admin" ? "/admin" : "/");
    } else {
      const msg = result.payload || "Login failed";
      toast.error(msg);
      if (msg.toLowerCase().includes("verify")) {
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      }
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--color-surface-alt)" }}
    >
      <header
        className="flex items-center justify-between px-6 py-4 md:px-10"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <Link to="/" className="flex items-center gap-2">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--color-brand-blue)" }}
          >
            ecommerce
          </span>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium transition hover:opacity-70"
          style={{ color: "var(--color-text-muted)" }}
        >
          <FiHome size={16} />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8 md:px-10">
        <div
          className="grid w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl md:grid-cols-2"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <aside
            className="relative hidden flex-col justify-between p-8 text-white md:flex md:p-10"
            style={{
              background:
                "linear-gradient(160deg, var(--color-brand-gradient-start) 0%, var(--color-brand-gradient-end) 100%)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
              <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-white/5" />
            </div>

            <div className="relative z-10">
              <span className="text-2xl font-bold tracking-tight">
                ecommerce
              </span>
              <h2 className="mt-8 text-3xl font-bold leading-tight">
                Welcome Back!
              </h2>
              <p className="mt-2 max-w-xs text-sm text-white/80">
                Sign in to your account and continue shopping the best
                products.
              </p>

              <div className="mt-10 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 -z-10 rounded-full bg-white/10 blur-2xl" />
                  <svg
                    viewBox="0 0 200 160"
                    className="h-40 w-56 drop-shadow-xl"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="30" y="50" width="140" height="90" rx="10" fill="#ffffff" opacity="0.15" />
                    <rect x="40" y="30" width="30" height="30" rx="4" fill="#fbbf24" />
                    <rect x="85" y="25" width="30" height="30" rx="4" fill="#3b82f6" />
                    <circle cx="90" cy="120" r="10" fill="#ffffff" />
                    <circle cx="140" cy="120" r="10" fill="#ffffff" />
                    <path d="M55 70 L65 70 L75 110 L150 110 L160 80 L80 80" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <ul className="relative z-10 mt-10 space-y-4">
              {[
                { icon: <HiOutlineShieldCheck size={20} />, title: "Best Quality Products", desc: "Top brands & great prices" },
                { icon: <HiOutlineTruck size={20} />, title: "Fast & Secure Delivery", desc: "Track your orders easily" },
                { icon: <HiOutlineSupport size={20} />, title: "24/7 Customer Support", desc: "We're always here to help" },
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                    {f.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="text-xs text-white/70">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          <section className="p-6 sm:p-8 md:p-10">
            <div
              className="mb-8 flex border-b"
              style={{ borderColor: "var(--color-divider)" }}
            >
              <button
                type="button"
                className="relative px-4 pb-3 text-sm font-semibold"
                style={{ color: "var(--color-tab-active)" }}
              >
                Login
                <span
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full"
                  style={{ backgroundColor: "var(--color-tab-active)" }}
                />
              </button>
              <Link
                to="/signup"
                className="px-4 pb-3 text-sm font-medium transition hover:opacity-80"
                style={{ color: "var(--color-tab-inactive)" }}
              >
                Sign Up
              </Link>
            </div>

            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Login to Your Account
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Enter your email and password to continue.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <FiMail
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    size={16}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2"
                    style={{
                      backgroundColor: "var(--color-input-bg)",
                      borderColor: errors.email
                        ? "var(--color-danger)"
                        : "var(--color-input-border)",
                      color: "var(--color-text)",
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  Password
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    size={16}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm outline-none transition focus:ring-2"
                    style={{
                      backgroundColor: "var(--color-input-bg)",
                      borderColor: errors.password
                        ? "var(--color-danger)"
                        : "var(--color-input-border)",
                      color: "var(--color-text)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--color-text-muted)" }}
                    aria-label="Toggle password"
                  >
                    {/* ✅ FIXED: showPassword true → FiEye (click to hide), false → FiEyeOff (click to show) */}
                    {showPassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300"
                    style={{ accentColor: "var(--color-check-bg)" }}
                  />
                  <span style={{ color: "var(--color-text)" }}>Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold hover:underline"
                  style={{ color: "var(--color-link)" }}
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                style={{ backgroundColor: "var(--color-brand-blue)" }}
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Logging in...
                  </>
                ) : (
                  <>Login <span aria-hidden>→</span></>
                )}
              </button>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1" style={{ backgroundColor: "var(--color-divider)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>OR</span>
                <span className="h-px flex-1" style={{ backgroundColor: "var(--color-divider)" }} />
              </div>

              <button
                type="button"
                onClick={() => toast("Google login coming soon")}
                className="flex w-full items-center justify-center gap-3 rounded-lg border py-2.5 text-sm font-medium transition hover:bg-slate-50"
                style={{
                  borderColor: "var(--color-input-border)",
                  color: "var(--color-text)",
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <FcGoogle size={18} />
                Continue with Google
              </button>
            </form>

            <p className="mt-6 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold hover:underline"
                style={{ color: "var(--color-link)" }}
              >
                Sign up
              </Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Login;