import { useState } from "react";
import { useDispatch } from "react-redux";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import Input from "../common/Input";
import Button from "../common/Button";
import { changePasswordThunk } from "../../store/slices/userSlice";
import useProfile from "../../hooks/useProfile";

const ChangePasswordForm = () => {
  const dispatch = useDispatch();
  const { saving } = useProfile();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.oldPassword) e.oldPassword = "Current password is required";
    if (!form.newPassword) e.newPassword = "New password is required";
    else if (form.newPassword.length < 6)
      e.newPassword = "Password must be at least 6 characters";
    if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const result = await dispatch(
      changePasswordThunk({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      })
    );

    if (changePasswordThunk.fulfilled.match(result)) {
      toast.success("Password changed successfully");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      toast.error(result.payload || "Password change failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3
        className="text-base font-bold"
        style={{ color: "var(--color-text)" }}
      >
        Change Password
      </h3>

      {/* Current Password */}
      <div className="relative">
        <FiLock
          className="absolute left-3 top-[42px] z-10"
          style={{ color: "var(--color-text-muted)" }}
        />
        <Input
          label="Current Password"
          name="oldPassword"
          type={showOld ? "text" : "password"}
          placeholder="••••••••"
          value={form.oldPassword}
          onChange={handleChange}
          error={errors.oldPassword}
          className="pl-10 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowOld((v) => !v)}
          aria-label={showOld ? "Hide password" : "Show password"}
          className="absolute right-3 top-[42px] z-10 rounded p-1 transition-colors hover:bg-black/5"
          style={{ color: "var(--color-text-muted)" }}
        >
          {showOld ? <FiEye size={16} /> : <FiEyeOff size={16} />}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* New Password */}
        <div className="relative">
          <FiLock
            className="absolute left-3 top-[42px] z-10"
            style={{ color: "var(--color-text-muted)" }}
          />
          <Input
            label="New Password"
            name="newPassword"
            type={showNew ? "text" : "password"}
            placeholder="••••••••"
            value={form.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            aria-label={showNew ? "Hide password" : "Show password"}
            className="absolute right-3 top-[42px] z-10 rounded p-1 transition-colors hover:bg-black/5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {showNew ? <FiEye size={16} /> : <FiEyeOff size={16} />}
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
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            className="absolute right-3 top-[42px] z-10 rounded p-1 transition-colors hover:bg-black/5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {showConfirm ? <FiEye size={16} /> : <FiEyeOff size={16} />}
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={saving}>
          Update Password
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;