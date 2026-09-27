import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FiUser, FiPhone, FiMapPin, FiGlobe, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import Input from "../common/Input";
import Button from "../common/Button";
import { updateProfileThunk } from "../../store/slices/userSlice";
import useProfile from "../../hooks/useProfile";

const ProfileForm = ({ initialData }) => {
  const dispatch = useDispatch();
  const { saving } = useProfile();

  const [form, setForm] = useState({
    phone: "",
    address: "",
    city: "",
    country: "",
    profileImage: "",
  });

  useEffect(() => {
    if (initialData?.profile) {
      setForm({
        phone: initialData.profile.phone || "",
        address: initialData.profile.address || "",
        city: initialData.profile.city || "",
        country: initialData.profile.country || "",
        profileImage: initialData.profile.profileImage || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfileThunk(form));
    if (updateProfileThunk.fulfilled.match(result)) {
      toast.success("Profile updated");
    } else {
      toast.error(result.payload || "Update failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card space-y-4"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <h3
        className="text-base font-bold"
        style={{ color: "var(--color-text)" }}
      >
        Personal Information
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <FiPhone
            className="absolute left-3 top-[42px] z-10"
            style={{ color: "var(--color-text-muted)" }}
          />
          <Input
            label="Phone"
            name="phone"
            placeholder="+92 300 1234567"
            value={form.phone}
            onChange={handleChange}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <FiGlobe
            className="absolute left-3 top-[42px] z-10"
            style={{ color: "var(--color-text-muted)" }}
          />
          <Input
            label="Country"
            name="country"
            placeholder="Pakistan"
            value={form.country}
            onChange={handleChange}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <FiMapPin
            className="absolute left-3 top-[42px] z-10"
            style={{ color: "var(--color-text-muted)" }}
          />
          <Input
            label="City"
            name="city"
            placeholder="Lahore"
            value={form.city}
            onChange={handleChange}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <FiImage
            className="absolute left-3 top-[42px] z-10"
            style={{ color: "var(--color-text-muted)" }}
          />
          <Input
            label="Profile Image URL"
            name="profileImage"
            placeholder="https://..."
            value={form.profileImage}
            onChange={handleChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="relative">
        <FiUser
          className="absolute left-3 top-[42px] z-10"
          style={{ color: "var(--color-text-muted)" }}
        />
        <Input
          label="Address"
          name="address"
          placeholder="Street, area, house no."
          value={form.address}
          onChange={handleChange}
          className="pl-10"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={saving}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;