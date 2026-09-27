import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FiLock, FiHome } from "react-icons/fi";
import {
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineSupport,
} from "react-icons/hi";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { resetPasswordApi } from "../../services/authService";

const SetNewPassword = () => {
  const [params] = useSearchParams();
  const emailFromQuery = params.get("email") || "";
  const otpFromQuery = params.get("otp") || "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emailFromQuery || !otpFromQuery) {
      toast.error("Session expired. Please start over.");
      navigate("/forgot-password");
    }
  }, [emailFromQuery, otpFromQuery, navigate]);

  const validate = () => {
    const e = {};

    const STRONG_PASSWORD_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+\-=[\]\\;'`~]).{8,}$/;

    if (!newPassword) e.newPassword = "New password is required";
    else if (!STRONG_PASSWORD_REGEX.test(newPassword))
      e.newPassword =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";

    if (newPassword !== confirmPassword)
      e.confirmPassword = "Passwords do not match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await resetPasswordApi({
        email: emailFromQuery,
        otp: otpFromQuery,
        newPassword,
      });
      toast.success("Password reset successful. Please login.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Reset failed";
      toast.error(msg);
      if (
        msg.toLowerCase().includes("otp") ||
        msg.toLowerCase().includes("expired")
      ) {
        navigate(`/reset-password?email=${encodeURIComponent(emailFromQuery)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--color-surface-alt)" }}
    >
      {/* TOP BAR */}
      <header
        className="flex items-center justify-between px-6 py-4 md:px-10"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-blue-700">
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

      {/* MAIN */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 md:px-10">
        <div
          className="grid w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl md:grid-cols-2"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          {/* LEFT: BRAND PANEL */}
          <aside className="relative hidden flex-col justify-between bg-gradient-to-br from-blue-800 to-blue-600 p-8 text-white md:flex md:p-10">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
              <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-white/5" />
            </div>

            <div className="relative z-10">
              <span className="text-2xl font-bold tracking-tight">
                ecommerce
              </span>
              <h2 className="mt-8 text-3xl font-bold leading-tight">
                Step 2 of 2
              </h2>
              <p className="mt-2 max-w-xs text-sm text-white/80">
                Almost done — choose a new password to secure your account.
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
                    <rect
                      x="30"
                      y="50"
                      width="140"
                      height="90"
                      rx="10"
                      fill="#ffffff"
                      opacity="0.15"
                    />
                    <rect
                      x="40"
                      y="30"
                      width="30"
                      height="30"
                      rx="4"
                      fill="#fbbf24"
                    />
                    <rect
                      x="85"
                      y="25"
                      width="30"
                      height="30"
                      rx="4"
                      fill="#3b82f6"
                    />
                    <circle cx="90" cy="120" r="10" fill="#ffffff" />
                    <circle cx="140" cy="120" r="10" fill="#ffffff" />
                    <path
                      d="M55 70 L65 70 L75 110 L150 110 L160 80 L80 80"
                      stroke="#ffffff"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <ul className="relative z-10 mt-10 space-y-4">
              {[
                {
                  icon: <HiOutlineShieldCheck size={20} />,
                  title: "Best Quality Products",
                  desc: "Top brands & great prices",
                },
                {
                  icon: <HiOutlineTruck size={20} />,
                  title: "Fast & Secure Delivery",
                  desc: "Track your orders easily",
                },
                {
                  icon: <HiOutlineSupport size={20} />,
                  title: "24/7 Customer Support",
                  desc: "We're always here to help",
                },
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

          {/* RIGHT: FORM */}
          <section className="p-6 sm:p-8 md:p-10">
            {/* Progress */}
            <div className="mb-6 flex items-center gap-2 text-xs">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: "var(--color-success)" }}
              >
                ✓
              </span>
              <span style={{ color: "var(--color-text-muted)" }}>
                Verify OTP
              </span>
              <span
                className="h-px flex-1"
                style={{ backgroundColor: "var(--color-divider)" }}
              />
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                2
              </span>
              <span
                className="font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                New Password
              </span>
            </div>

            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Set New Password
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Choose a strong password for your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* New Password */}
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-[42px] z-10"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword)
                      setErrors({ ...errors, newPassword: "" });
                  }}
                  error={errors.newPassword}
                  className="pl-10"
                />
                <p
                  className="mt-1 text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Min 8 characters with uppercase, lowercase, number, and
                  special character
                </p>
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-[42px] z-10"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: "" });
                  }}
                  error={errors.confirmPassword}
                  className="pl-10"
                />
              </div>

              <Button type="submit" loading={loading} className="w-full">
                Reset Password
              </Button>
            </form>

            <p
              className="mt-6 text-center text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              <Link
                to={`/reset-password?email=${encodeURIComponent(
                  emailFromQuery
                )}`}
                className="font-semibold hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                ← Back to OTP
              </Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SetNewPassword;