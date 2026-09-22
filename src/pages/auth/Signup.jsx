import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import AuthLayout from "../../components/auth/AuthLayout";
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

    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 6)
      e.password = "Password must be at least 6 characters";

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
      toast.success("Signup successful! Check OTP.");
      // In dev: backend returns devOtp — auto-fill on OTP page
      const devOtp = result.payload?.data?.devOtp;
      if (devOtp) {
        toast(`Dev OTP: ${devOtp}`, { icon: "🔐", duration: 6000 });
      }
      navigate(`/verify-otp?email=${encodeURIComponent(payload.email)}`);
    } else {
      toast.error(result.payload || "Signup failed");
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to start shopping"
      footer={
        <p
          className="text-center text-sm"
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
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="absolute right-3 top-[42px] z-10 p-1 rounded transition-colors hover:bg-black/5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {showPassword ? <FiEye /> : <FiEyeOff />}
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
              showConfirmPassword ? "Hide confirm password" : "Show confirm password"
            }
            aria-pressed={showConfirmPassword}
            title={
              showConfirmPassword ? "Hide confirm password" : "Show confirm password"
            }
            className="absolute right-3 top-[42px] z-10 p-1 rounded transition-colors hover:bg-black/5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {showConfirmPassword ? <FiEye /> : <FiEyeOff  />}
          </button>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Sign Up
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Signup;