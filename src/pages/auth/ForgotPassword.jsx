import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiHome } from "react-icons/fi";
import {
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineSupport,
} from "react-icons/hi";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { forgotPasswordApi } from "../../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Valid email is required");
      return;
    }

    try {
      setLoading(true);
      await forgotPasswordApi({ email });
      toast.success("Reset OTP sent to your email");
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
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

      {/* MAIN CARD */}
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
                Forgot Your Password?
              </h2>
              <p className="mt-2 max-w-xs text-sm text-white/80">
                No worries — we'll help you get back into your account.
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
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Forgot Password
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Enter your email to receive a reset OTP
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="relative">
                <FiMail
                  className="absolute left-3 top-[42px] z-10"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  error={error}
                  className="pl-10"
                />
              </div>

              <Button type="submit" loading={loading} className="w-full">
                Send Reset OTP
              </Button>
            </form>

            <p
              className="mt-6 text-center text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Remembered?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Back to Login
              </Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;