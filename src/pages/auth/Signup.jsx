import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiHome,
} from "react-icons/fi";
import {
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineSupport,
} from "react-icons/hi";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { signupThunk } from "../../store/slices/authSlice";
import useAuth from "../../hooks/useAuth";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};

    if (!formData.name.trim()) e.name = "Name is required";
    else if (formData.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";

    if (!formData.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      e.email = "Invalid email format";

    const STRONG_PASSWORD_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+\-=[\]\\;'`~]).{8,}$/;

    if (!formData.password) e.password = "Password is required";
    else if (!STRONG_PASSWORD_REGEX.test(formData.password))
      e.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";

    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    const result = await dispatch(signupThunk(payload));

    if (signupThunk.fulfilled.match(result)) {
      toast.success("Signup successful! Check your email for the OTP.");
      navigate(`/verify-otp?email=${encodeURIComponent(payload.email)}`);
    } else {
      toast.error(result.payload || "Signup failed");
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

      <main className="flex flex-1 items-center justify-center px-4 py-8 md:px-10">
        <div
          className="grid w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl md:grid-cols-2"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
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
                Join Us Today!
              </h2>
              <p className="mt-2 max-w-xs text-sm text-white/80">
                Create your account and start shopping the best products.
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

          <section className="p-6 sm:p-8 md:p-10">
            <div
              className="mb-8 flex border-b"
              style={{ borderColor: "var(--color-divider)" }}
            >
              <Link
                to="/login"
                className="px-4 pb-3 text-sm font-medium transition hover:opacity-80"
                style={{ color: "var(--color-tab-inactive)" }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="relative px-4 pb-3 text-sm font-semibold"
                style={{ color: "var(--color-tab-active)" }}
              >
                Sign Up
                <span
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full"
                  style={{ backgroundColor: "var(--color-tab-active)" }}
                />
              </Link>
            </div>

            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Create Account
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Sign up to start shopping
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Full Name */}
              <div className="relative">
                <FiUser
                  className="absolute left-3 top-[42px] z-10"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  className="pl-10"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <FiMail
                  className="absolute left-3 top-[42px] z-10"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  className="pl-10"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-[42px] z-10"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-[42px] z-10 rounded p-1 transition-colors hover:bg-black/5"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {showPassword ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-[42px] z-10"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  aria-pressed={showConfirmPassword}
                  title={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-[42px] z-10 rounded p-1 transition-colors hover:bg-black/5"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                </button>
              </div>

              <Button type="submit" loading={loading} className="w-full">
                Sign Up
              </Button>
            </form>

            <p
              className="mt-5 text-center text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Login
              </Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Signup;