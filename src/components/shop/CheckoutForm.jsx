import { useState } from "react";
import { FiUser, FiPhone, FiMapPin, FiGlobe, FiHome } from "react-icons/fi";

const CheckoutForm = ({ initial = {}, loading = false, onSubmit }) => {
  const [form, setForm] = useState({
    name: initial.name || "",
    phone: initial.phone || "",
    address: initial.address || "",
    city: initial.city || "",
    country: initial.country || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (form.phone.trim().length > 20) e.phone = "Max 20 characters";
    if (!form.address.trim()) e.address = "Address is required";
    else if (form.address.trim().length > 200) e.address = "Max 200 characters";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.country.trim()) e.country = "Country is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
    });
  };

  const input = (name, label, icon, placeholder) => (
    <div className="relative">
      {icon}
      <label
        className="mb-1.5 block text-sm font-medium"
        style={{ color: "var(--color-text)" }}
      >
        {label}
      </label>
      <input
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2"
        style={{
          backgroundColor: "var(--color-input-bg)",
          borderColor: errors[name]
            ? "var(--color-danger)"
            : "var(--color-input-border)",
          color: "var(--color-text)",
        }}
      />
      {errors[name] && (
        <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  const iconStyle = {
    color: "var(--color-text-muted)",
    position: "absolute",
    left: "12px",
    top: "42px",
    zIndex: 10,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {input("name", "Full Name", <FiUser style={iconStyle} size={16} />, "John Doe")}
      {input("phone", "Phone", <FiPhone style={iconStyle} size={16} />, "0300 1234567")}
      {input("address", "Address", <FiHome style={iconStyle} size={16} />, "House 12, Street 4, DHA")}
      {input("city", "City", <FiMapPin style={iconStyle} size={16} />, "Lahore")}
      {input("country", "Country", <FiGlobe style={iconStyle} size={16} />, "Pakistan")}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-60"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {loading ? "Placing order…" : "Place Order"}
      </button>
    </form>
  );
};

export default CheckoutForm;