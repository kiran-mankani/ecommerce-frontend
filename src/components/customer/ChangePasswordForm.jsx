import { useState } from "react";
import { useDispatch } from "react-redux";
import { FiLock } from "react-icons/fi";
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};

    if (!form.oldPassword) e.oldPassword = "Current password is required";

    const STRONG_PASSWORD_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+\-=[\]\\;'`~]).{8,}$/;

    if (!form.newPassword) e.newPassword = "New password is required";
    else if (!STRONG_PASSWORD_REGEX.test(form.newPassword))
      e.newPassword =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";

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
          type="password"
          placeholder="••••••••"
          value={form.oldPassword}
          onChange={handleChange}
          error={errors.oldPassword}
          className="pl-10"
        />
      </div>

      {/* New Password */}
      <div className="relative">
        <FiLock
          className="absolute left-3 top-[42px] z-10"
          style={{ color: "var(--color-text-muted)" }}
        />
        <Input
          label="New Password"
          name="newPassword"
          type="password"
          placeholder="••••••••"
          value={form.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          className="pl-10"
        />
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
          type="password"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          className="pl-10"
        />
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