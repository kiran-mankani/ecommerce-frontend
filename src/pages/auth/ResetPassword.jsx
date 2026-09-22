import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import AuthLayout from "../../components/auth/AuthLayout";
import { resetPasswordApi } from "../../services/authService";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const emailFromQuery = params.get("email") || "";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!formData.otp || formData.otp.length !== 6) e.otp = "Enter 6-digit OTP";
    if (!formData.newPassword) e.newPassword = "New password required";
    else if (formData.newPassword.length < 6)
      e.newPassword = "Password must be at least 6 characters";
    if (formData.newPassword !== formData.confirmPassword)
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
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      toast.success("Password reset successful. Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle={`Enter OTP sent to ${emailFromQuery}`}
      footer={
        <p
          className="text-center text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          <Link
            to="/login"
            className="font-semibold hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Back to Login
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="OTP"
          name="otp"
          placeholder="123456"
          maxLength={6}
          value={formData.otp}
          onChange={(e) =>
            setFormData({
              ...formData,
              otp: e.target.value.replace(/\D/g, ""),
            })
          }
          error={errors.otp}
          className="text-center tracking-[0.5em]"
        />

        {/* New Password */}
        <div className="relative">
          <FiLock
            className="absolute left-3 top-[42px] z-10"
            style={{ color: "var(--color-text-muted)" }}
          />
          <Input
            label="New Password"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((v) => !v)}
            aria-label={showNewPassword ? "Hide password" : "Show password"}
            aria-pressed={showNewPassword}
            title={showNewPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-[42px] z-10 p-1 rounded transition-colors hover:bg-black/5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {showNewPassword ? <FiEye  /> : <FiEyeOff/>}
          </button>
        </div>

        {/* Confirm New Password */}
        <div className="relative">
          <FiLock
            className="absolute left-3 top-[42px] z-10"
            style={{ color: "var(--color-text-muted)" }}
          />
          <Input
            label="Confirm New Password"
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
            {showConfirmPassword ? <FiEye   /> : <FiEyeOff/>}
          </button>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;