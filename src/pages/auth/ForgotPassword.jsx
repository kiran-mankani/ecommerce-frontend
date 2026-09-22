import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import AuthLayout from "../../components/auth/AuthLayout";
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
      const res = await forgotPasswordApi({ email });
      toast.success("Reset OTP sent to your email");
      const devOtp = res?.data?.devOtp;
      if (devOtp) toast(`Dev OTP: ${devOtp}`, { icon: "🔐", duration: 6000 });
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a reset OTP"
      footer={
        <p
          className="text-center text-sm"
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
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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
    </AuthLayout>
  );
};

export default ForgotPassword;