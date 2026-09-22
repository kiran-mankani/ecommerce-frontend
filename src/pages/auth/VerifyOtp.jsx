import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import AuthLayout from "../../components/auth/AuthLayout";
import { verifyOtpThunk } from "../../store/slices/authSlice";
import { resendOtpApi } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

const VerifyOtp = () => {
  const [params] = useSearchParams();
  const emailFromQuery = params.get("email") || "";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useAuth();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!emailFromQuery) {
      toast.error("Email missing. Please signup again.");
      navigate("/signup");
    }
  }, [emailFromQuery, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Enter a 6-digit OTP");
      return;
    }

    const result = await dispatch(
      verifyOtpThunk({ email: emailFromQuery, otp })
    );

    if (verifyOtpThunk.fulfilled.match(result)) {
      toast.success("Email verified! Please login.");
      navigate("/login");
    } else {
      toast.error(result.payload || "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      const res = await resendOtpApi({ email: emailFromQuery });
      toast.success("OTP resent");
      const devOtp = res?.data?.devOtp;
      if (devOtp) toast(`Dev OTP: ${devOtp}`, { icon: "🔐", duration: 6000 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify Email"
      subtitle={`We sent a 6-digit OTP to ${emailFromQuery}`}
      footer={
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-semibold hover:underline disabled:opacity-60"
            style={{ color: "var(--color-primary)" }}
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>
          <Link
            to="/signup"
            className="hover:underline"
            style={{ color: "var(--color-text-muted)" }}
          >
            Change email
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Enter OTP"
          name="otp"
          placeholder="123456"
          value={otp}
          maxLength={6}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, ""));
            if (error) setError("");
          }}
          error={error}
          className="text-center text-lg tracking-[0.5em]"
        />

        <Button type="submit" loading={loading} className="w-full">
          Verify
        </Button>
      </form>
    </AuthLayout>
  );
};

export default VerifyOtp;